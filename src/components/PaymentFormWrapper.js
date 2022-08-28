import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';

import ChoosePaymentMethod from '@components/ChoosePaymentMethod';
import ConfirmPaymentMethod from '@components/ConfirmPaymentMethod';
import PaymentFormInfo from '@components/PaymentFormInfo';
import PaymentFormInputs from '@components/PaymentFormInputs';
import SecurityQuestion from '@components/SecurityQuestion';
import ThankYou from '@components/ThankYou';
import ShoppingCartContext from '@context/ShoppingCartContext';
import Web3Context from '@context/Web3Context';
import CountriesWithProvinces from '@static-data/countries-with-provinces';

export default function PaymentFormWrapper({ isCheckout }) {
  const router = useRouter();
  const { query } = router;

  const { removeAllFromCart, selectedFrames } = useContext(ShoppingCartContext);
  const { address, sendTransaction } = useContext(Web3Context);

  const [shippingInfoFormSubmitted, setShippingInfoFormSubmitted] =
    useState(true);
  const [choosePaymentMethod, setChoosePaymentMethod] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('WALLET');
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState(false);
  const [transactionPassed, setTransactionPassed] = useState(false);

  useEffect(() => {
    const orderNumber = query['order-number'];
    const paymentMethodValue = orderNumber ? 'CARD' : '';

    if (orderNumber) {
      removeAllFromCart();
    }

    setPaymentMethod(paymentMethodValue);
    setTransactionPassed(!!orderNumber);

    if (orderNumber) {
      axios
        .post('/api/orders', {
          _id: orderNumber,
          transactionStatus: 'SUCCESS',
        })
        .then(console.log);
    }
  }, [query]);

  const shippingInfoFormik = useFormik({
    initialValues: {
      // firstName: '',
      // lastName: '',
      // email: '',
      // addressLine1: '',
      // addressLine2: '',
      // country: '',
      // region: '',
      // city: '',
      // postalCode: '',
      firstName: 'First',
      lastName: 'Last',
      email: 'bulatovicnikola1990@gmail.com',
      addressLine1: 'Address 123',
      addressLine2: '',
      country: 'United States',
      region: 'Alabama',
      city: 'Huntsville',
      postalCode: '11111',
    },
    validationSchema: Yup.object({
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
    onSubmit: (values) => {
      console.log('Submit: ', values);
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
    onSubmit: (values) => {
      console.log('Submit: ', values);
      // eslint-disable-next-line no-use-before-define
      onPayWithStripeClick();
    },
  });

  const createOrder = () => {
    const order = {
      customer: { ...shippingInfoFormik.values },
      frames: selectedFrames,
      paymentMethod,
      transactionStatus: 'PENDING',
      ...securityQuestionFormik.values,
    };

    if (paymentMethod === 'CARD') {
      Object.assign(
        order,
        { ...securityQuestionFormik.values },
        { claimed: false }
      );
    } else {
      order.claimed = true;
    }

    return order;
  };

  const payWithWallet = async () => {
    // const order = createOrder();
    const tx = await sendTransaction(selectedFrames);

    if (tx) {
      // removeAllFromCart();
      setTransactionPassed(true);
    } else {
      // const postToApi = await axios.post('/api/customers', order);
      // console.log('API Post: ', postToApi);
      setTransactionPassed(false);
    }
  };

  const onPayWithStripeClick = async () => {
    const values = createOrder();

    try {
      const {
        data: {
          data: { _id: id },
        },
      } = await axios.post('/api/orders', values);
      const checkoutCall = await axios.post('/api/checkout', {
        items: selectedFrames,
        orderNumber: id,
      });
      const { url } = checkoutCall.data;
      window.location = url;
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const goBack = () => {
    if (confirmPaymentMethod) {
      setConfirmPaymentMethod(false);
    } else if (paymentMethod) {
      setPaymentMethod('');
    } else if (choosePaymentMethod) {
      setChoosePaymentMethod(false);
    } else if (shippingInfoFormSubmitted) {
      setShippingInfoFormSubmitted(false);
    }
  };

  return (
    <div
      className={`payment-form${
        isCheckout ? '' : ' payment-form--hidden-small-devices'
      }`}
    >
      {transactionPassed && <ThankYou paymentMethod={paymentMethod} />}
      {!transactionPassed && (
        <>
          {!shippingInfoFormSubmitted && (
            <PaymentFormInputs formik={shippingInfoFormik} />
          )}
          {shippingInfoFormSubmitted && !choosePaymentMethod && (
            <PaymentFormInfo
              setChoosePaymentMethod={setChoosePaymentMethod}
              values={shippingInfoFormik.values}
              walletConnected={!!address}
            />
          )}
          {choosePaymentMethod && !paymentMethod && (
            <ChoosePaymentMethod setPaymentMethod={setPaymentMethod} />
          )}
          {!!paymentMethod && !confirmPaymentMethod && (
            <ConfirmPaymentMethod
              paymentMethod={paymentMethod}
              payWithWallet={payWithWallet}
              setConfirmPaymentMethod={setConfirmPaymentMethod}
            />
          )}
          {paymentMethod === 'CARD' && confirmPaymentMethod && (
            <SecurityQuestion formik={securityQuestionFormik} />
          )}
          <button className="btn btn--tertiary" onClick={goBack} type="button">
            Back
          </button>
        </>
      )}
    </div>
  );
}
