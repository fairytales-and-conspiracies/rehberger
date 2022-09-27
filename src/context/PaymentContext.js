import axios from 'axios';
import { useFormik } from 'formik';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import ShoppingCartContext from '@/context/ShoppingCartContext';
import Web3Context from '@/context/Web3Context';
import CountriesWithProvinces from '@/static-data/countries-with-provinces';
import calculateVat from '@/utils/vat';
import UniCryptContext from './UniCryptContext';

const PaymentContext = createContext();

const BILLING_INFO_INITIAL_VALUES = {
  // company: '',
  // vatNo: '',
  // firstName: '',
  // lastName: '',
  // email: '',
  // addressLine1: '',
  // addressLine2: '',
  // country: '',
  // region: '',
  // city: '',
  // postalCode: '',
  company: '',
  vatNo: '',
  firstName: 'First',
  lastName: 'Last',
  email: 'bulatovicnikola1990@gmail.com',
  addressLine1: 'Address 123',
  addressLine2: '',
  country: 'United States',
  region: 'Alabama',
  city: 'Huntsville',
  postalCode: '11111',
};
const NFT_PRICE_ETH = process.env.NEXT_PUBLIC_NFT_PRICE_ETH;

export const PaymentProvider = ({ children }) => {
  const { removeAllFromCart, removeManyFromCart, selectedFrames } =
    useContext(ShoppingCartContext);
  const { sendTransaction } = useContext(Web3Context);

  const [alreadySoldFrames, setAlreadySoldFrames] = useState([]);
  const [choosePaymentMethod, setChoosePaymentMethod] = useState(false);
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState(false);
  const [isPaymentBeingProcessed, setIsPaymentBeingProcessed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingInfoFormSubmitted, setShippingInfoFormSubmitted] =
    useState(false);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [transactionPassed, setTransactionPassed] = useState(false);
  const [vat, setVat] = useState(0.0);

  useEffect(() => {
    if (selectedFrames) {
      const price = selectedFrames.length * NFT_PRICE_ETH;
      setTotalPrice(price.toFixed(3));
    }
  }, [selectedFrames]);

  const infoFormik = useFormik({
    initialValues: BILLING_INFO_INITIAL_VALUES,
    validationSchema: Yup.object({
      company: Yup.string(),
      vatNo: Yup.string().matches(
        /^[A-Z]{2}[A-Z0-9]{6,13}$/,
        'Incorrect format'
      ),
      firstName: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .trim()
        .required('Required'),
      lastName: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .required('Required'),
      email: Yup.string().email('Enter a valid email').required('Required'),
      addressLine1: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      addressLine2: Yup.string().max(50, 'Must be 50 characters or less'),
      country: Yup.string().required('Required'),
      region: Yup.string()
        .nullable()
        .when('country', {
          is: (country) => CountriesWithProvinces.includes(country),
          then: Yup.string().nullable().required('Required'),
        }),
      city: Yup.string()
        .max(60, 'Must be 60 characters or less')
        .required('Required'),
      postalCode: Yup.string()
        .max(12, 'Must be 12 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      const { country, vatNo } = values;
      const tax = calculateVat(country, vatNo);
      setVat(tax);
      setShippingInfoFormSubmitted(true);
    },
  });

  const securityQuestionFormik = useFormik({
    initialValues: {
      noSecurityQuestion: false,
      question: '',
      answer: '',
    },
    validationSchema: Yup.object({
      noSecurityQuestion: Yup.boolean().required('Required'),
      question: Yup.string().when('noSecurityQuestion', {
        is: (noSecurityQuestion) => !noSecurityQuestion,
        then: Yup.string().required('Required if you want a security question'),
      }),
      answer: Yup.string().when('noSecurityQuestion', {
        is: (noSecurityQuestion) => !noSecurityQuestion,
        then: Yup.string().required('Required if you want a security question'),
      }),
    }),
    onSubmit: () => {
      // eslint-disable-next-line no-use-before-define
      pay();
    },
  });

  const { fetchEthToEurRate } = useContext(UniCryptContext);

  const createOrder = async () => {
    const ethToEurRate = await fetchEthToEurRate();
    
    const order = {
      customer: { ...infoFormik.values },
      frames: selectedFrames,
      paymentMethod,
      ethToEurRate,
    };

    if (paymentMethod === 'CARD') {
      Object.assign(order, { ...securityQuestionFormik.values });
    }

    return order;
  };

  const haveSomeFramesHaveBeenSold = async () => {
    const requestBody = selectedFrames.reduce((acc, frame) => {
      if (!acc[frame.video]) {
        acc[frame.video] = [];
      }
      acc[frame.video].push(frame.frame);
      return acc;
    }, {});

    const {
      data: { data: soldFrames },
    } = await axios.post('/api/frames', requestBody);
    setAlreadySoldFrames(soldFrames);
    removeManyFromCart(soldFrames);
    return soldFrames.length > 0;
  };

  const payWithWallet = async () => {
    // const tx = {
    //   transactionHash:
    //     '0x103da2af32e9e7e129679fad4b927a965ff05a8bf90949d93af0eaa30e767d13',
    // };
    setIsPaymentBeingProcessed(true);
    const tx = await sendTransaction(selectedFrames);

    if (tx) {
      const order = await createOrder();
      order.transactionHash = tx.transactionHash;
      await axios.post('/api/orders', order);
      setIsPaymentBeingProcessed(false);
      setTransactionPassed(true);
      removeAllFromCart();
    } else {
      // TODO: LOG
      setIsPaymentBeingProcessed(false);
      setTransactionPassed(false);
    }
  };

  const payWithStripe = async () => {
    const order = await createOrder();
    // TODO: LOG

    try {
      const {
        data: { url },
      } = await axios.post('/api/orders', order);
      window.location = url;
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const pay = async () => {
    const haveFramesBeenSold = await haveSomeFramesHaveBeenSold();
    if (haveFramesBeenSold) {
      return;
    }

    if (paymentMethod === 'WALLET') {
      payWithWallet();
    } else {
      payWithStripe();
    }
  };

  const setInitialState = () => {
    setAlreadySoldFrames([]);
    setChoosePaymentMethod(false);
    setConfirmPaymentMethod(false);
    setIsPaymentBeingProcessed(false);
    setPaymentMethod(null);
    setShippingInfoFormSubmitted(false);
    setTransactionPassed(false);
  };

  const memoizedValue = useMemo(
    () => ({
      alreadySoldFrames,
      choosePaymentMethod,
      confirmPaymentMethod,
      infoFormik,
      isPaymentBeingProcessed,
      paymentMethod,
      pay,
      securityQuestionFormik,
      setAlreadySoldFrames,
      setChoosePaymentMethod,
      setConfirmPaymentMethod,
      setIsPaymentBeingProcessed,
      setInitialState,
      setPaymentMethod,
      setShippingInfoFormSubmitted,
      setTransactionPassed,
      shippingInfoFormSubmitted,
      totalPrice,
      transactionPassed,
      vat,
    }),
    [
      alreadySoldFrames,
      choosePaymentMethod,
      confirmPaymentMethod,
      infoFormik,
      isPaymentBeingProcessed,
      paymentMethod,
      pay,
      securityQuestionFormik,
      setAlreadySoldFrames,
      setChoosePaymentMethod,
      setConfirmPaymentMethod,
      setIsPaymentBeingProcessed,
      setInitialState,
      setPaymentMethod,
      setShippingInfoFormSubmitted,
      setTransactionPassed,
      shippingInfoFormSubmitted,
      totalPrice,
      transactionPassed,
      vat,
    ]
  );

  return (
    <PaymentContext.Provider value={memoizedValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;
