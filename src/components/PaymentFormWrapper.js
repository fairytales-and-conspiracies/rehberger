import { useWeb3 } from '@3rdweb/hooks';
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
import { address as contractAddress, abi } from '@contract/exampleContract';
import CountriesWithProvinces from '@static-data/countries-with-provinces';
import { web3Metamask } from '@utils/web3';

export default function PaymentFormWrapper({ isCheckout, setIsCheckout }) {
  const ADDRESS_FROM = process.env.NEXT_PUBLIC_ADDRESS_FROM;

  const router = useRouter();
  const { query } = router;

  const { address } = useWeb3();

  const { selectedFrames } = useContext(ShoppingCartContext);

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [shippingInfoFormSubmitted, setShippingInfoFormSubmitted] =
    useState(false);
  const [choosePaymentMethod, setChoosePaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState(false);
  const [transactionPassed, setTransactionPassed] = useState(false);

  useEffect(() => {
    const orderNumber = query['order-number'];
    const paymentMethodValue = !!orderNumber ? 'CARD' : '';

    setPaymentMethod(paymentMethodValue);
    setTransactionPassed(!!orderNumber);

    if (!!orderNumber) {
      axios
        .post('/api/orders', {
          _id: orderNumber,
          transactionStatus: 'SUCCESS',
        })
        .then(console.log);
    }
  }, [query]);

  useEffect(() => {
    if (!!address) {
      const web3 = web3Metamask();
      setWeb3(web3);

      const contract = new web3.eth.Contract(abi, contractAddress);
      setContract(contract);
    }
  }, [address]);

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
      onPayWithStripeClick();
    },
  });

  const createOrder = () => {
    const values = Object.assign(
      {
        frames: selectedFrames,
        paymentMethod,
        transactionStatus: 'PENDING',
      },
      {
        customer: { ...shippingInfoFormik.values },
      },
      securityQuestionFormik.values
    );
    return values;
  };

  const payWithWallet = async () => {
    const values = shippingInfoFormik.values;
    values.paymentMethod = 'WALLET';

    try {
      let tokenIds = selectedFrames.map((frame) => frame.frame);
      // TODO: Remove this next line which is only for testing purposes
      tokenIds = [77, 333];
      const amounts = Array(tokenIds.length).fill(1);

      const tx = await contract.methods
        .buyNFTs(ADDRESS_FROM, address, tokenIds, amounts, '0x00')
        .send({
          from: address,
          value: web3.utils.toWei(
            (tokenIds.length * 0.001).toString(),
            'ether'
          ),
        });

      console.log('Transaction: ', tx);

      const postToApi = await axios.post('/api/customers', values);

      console.log('API Post: ', postToApi);

      setTransactionPassed(true);
    } catch (err) {
      console.log('Error: ', err);

      const postToApi = await axios.post('/api/customers', values);

      console.log('API Post: ', postToApi);

      setTransactionPassed(false);
    }
  };

  const onPayWithStripeClick = async () => {
    const values = createOrder();

    try {
      const {
        data: { data: order },
      } = await axios.post('/api/orders', values);
      const checkoutCall = await axios.post('/api/checkout', {
        items: selectedFrames,
        orderNumber: order['_id'],
      });
      const url = checkoutCall.data.url;
      window.location = url;
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const goBack = () => {
    if (confirmPaymentMethod) {
      setConfirmPaymentMethod(false);
    } else if (!!paymentMethod) {
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
          <button className="btn btn--tertiary" onClick={goBack}>
            Back
          </button>
        </>
      )}
    </div>
  );
}
