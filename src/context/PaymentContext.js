import axios from 'axios';
import { useFormik } from 'formik';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import ShoppingCartContext from '@/context/ShoppingCartContext';
import Web3Context from '@/context/Web3Context';
import CountriesWithProvinces from '@/static-data/countries-with-provinces';

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
  const { removeAllFromCart, selectedFrames } = useContext(ShoppingCartContext);
  const { sendTransaction } = useContext(Web3Context);

  const [isPaymentBeingProcessed, setIsPaymentBeingProcessed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingInfoFormSubmitted, setShippingInfoFormSubmitted] =
    useState(false);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [transactionPassed, setTransactionPassed] = useState(true);

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
      vatNo: Yup.string(),
      firstName: Yup.string()
        .max(25, 'Must be 25 characters or less')
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
      region: Yup.string().when('country', {
        is: (country) => CountriesWithProvinces.includes(country),
        then: Yup.string().required('Required'),
      }),
      city: Yup.string()
        .max(60, 'Must be 60 characters or less')
        .required('Required'),
      postalCode: Yup.string()
        .max(12, 'Must be 12 characters or less')
        .required('Required'),
    }),
    onSubmit: () => {
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
      payWithStripe();
    },
  });

  const createOrder = () => {
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

  const payWithWallet = async () => {
    // const tx = {
    //   transactionHash:
    //     '0x103da2af32e9e7e129679fad4b927a965ff05a8bf90949d93af0eaa30e767d13',
    // };
    setIsPaymentBeingProcessed(true);
    const tx = await sendTransaction(selectedFrames);

    return;

    if (tx) {
      const order = createOrder();
      order.transactionHash = tx.transactionHash;
      await axios.post('/api/orders', order);
      setTransactionPassed(true);
      removeAllFromCart();
    } else {
      // const postToApi = await axios.post('/api/customers', order);
      // console.log('API Post: ', postToApi);
      // TODO: LOG
      setTransactionPassed(false);
    }
  };

  const payWithStripe = async () => {
    const order = createOrder();
    // TODO: LOG

    try {
      const {
        data: {
          data: { confirmationKey },
        },
      } = await axios.post('/api/orders', order);
      const checkoutCall = await axios.post('/api/checkout', {
        items: selectedFrames,
        confirmationKey,
      });
      const { url } = checkoutCall.data;
      window.location = url;
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const memoizedValue = useMemo(
    () => ({
      infoFormik,
      isPaymentBeingProcessed,
      paymentMethod,
      payWithStripe,
      payWithWallet,
      securityQuestionFormik,
      setIsPaymentBeingProcessed,
      setPaymentMethod,
      setShippingInfoFormSubmitted,
      setTransactionPassed,
      shippingInfoFormSubmitted,
      totalPrice,
      transactionPassed,
    }),
    [
      infoFormik,
      isPaymentBeingProcessed,
      paymentMethod,
      payWithStripe,
      payWithWallet,
      securityQuestionFormik,
      setIsPaymentBeingProcessed,
      setPaymentMethod,
      setShippingInfoFormSubmitted,
      setTransactionPassed,
      shippingInfoFormSubmitted,
      totalPrice,
      transactionPassed,
    ]
  );

  return (
    <PaymentContext.Provider value={memoizedValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;
