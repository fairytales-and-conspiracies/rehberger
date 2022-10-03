import axios from 'axios';
import { useFormik } from 'formik';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import ShoppingCartContext from '@/context/ShoppingCartContext';
import Web3Context from '@/context/Web3Context';
import CountriesWithProvinces from '@/static-data/countries-with-provinces';
import calculateVat from '@/utils/vat';

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

export const USER_EMAIL_SESSION_STORAGE_KEY = 'user_email';

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
      sessionStorage.setItem(
        USER_EMAIL_SESSION_STORAGE_KEY,
        JSON.stringify(values.email)
      );
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
    onSubmit: async (_, { setSubmitting }) => {
      // eslint-disable-next-line no-use-before-define
      await pay();
      setSubmitting(false);
    },
  });

  const createOrder = async () => {
    const order = {
      customer: { ...infoFormik.values },
      frames: selectedFrames,
      paymentMethod,
    };

    if (paymentMethod === 'CARD') {
      Object.assign(order, { ...securityQuestionFormik.values });
    }

    return order;
  };

  const haveSomeFramesHaveBeenSold = async () => {
    const email = sessionStorage.getItem(USER_EMAIL_SESSION_STORAGE_KEY);
    try {
      const {
        data: { reservations: successfullReservations },
      } = await axios.post('/api/reservations/set', { frames: selectedFrames, email });
      const unavailableFrames = selectedFrames.filter((frame) => !successfullReservations.find((successfullyReserved) => successfullyReserved._id === frame._id))
      setAlreadySoldFrames(unavailableFrames);
      removeManyFromCart(unavailableFrames);
      return unavailableFrames.length > 0;
    } catch (e) {
      console.log('Error: Set reservation api call failed', e);
      setAlreadySoldFrames(selectedFrames);
      removeManyFromCart(selectedFrames);
      return true;
    }
  };

  const payWithWallet = async () => {
    // const tx = {
    //   transactionHash:
    //     '0x103da2af32e9e7e129679fad4b927a965ff05a8bf90949d93af0eaa30e767d13',
    // };
    setIsPaymentBeingProcessed(true);
    const tx = await sendTransaction(selectedFrames);

    if (tx?.transactionHash) {
      const order = await createOrder();
      order.transactionHash = tx.transactionHash;
      
      try {
        const result = await axios.post('/api/wallet-order', order);
        console.log('Succ', result)
      } catch (err) {
        console.log('Error:', err);
      }

      setIsPaymentBeingProcessed(false);
      setTransactionPassed(true);
      removeAllFromCart();
    } else {
      setIsPaymentBeingProcessed(false);
      setTransactionPassed(false);
    }
  };

  const payWithStripe = async () => {
    const order = await createOrder();

    try {
      const {
        data: { url },
      } = await axios.post('/api/stripe-order', order);
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
      await payWithWallet();
    } else {
      await payWithStripe();
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
