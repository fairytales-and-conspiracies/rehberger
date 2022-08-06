import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import Header from '@components/Header';
import OrderVerification from '@components/OrderVerification';
import SecurityVerification from '@components/SecurityVerification';

export default function ClaimNFTs() {
  const [verificationAccepted, setVerificationAccepted] = useState(false);
  const [securityVerification, setSecurityVerification] = useState(false);
  const [
    orderVerificationSubmissionError,
    setOrderVerificationSubmissionError,
  ] = useState(null);
  const [
    securityVerificationSubmissionError,
    setSecurityVerificationSubmissionError,
  ] = useState(null);

  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    formik.setFieldValue('orderNumber', query['order-number']);
  }, [query]);

  const formik = useFormik({
    initialValues: {
      firstName: 'First',
      lastName: 'Last',
      orderNumber: '',
      walletAddress: 'j;aldjksf;adjksf',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .required('Required'),
      orderNumber: Yup.string().required('Required'),
      walletAddress: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      console.log('Submit: ', values);
      try {
        const {
          data: {
            data: { noSecurityQuestion, question },
          },
        } = await axios.post('/api/orders', {
          claimed: true,
          orderNumber: formik.values.orderNumber,
          securityVerification: false,
        });

        console.log(`PROPOS: ${noSecurityQuestion} --- ${question}`);

        if (!noSecurityQuestion) {
          securityFormik.setFieldValue('question', question);
          setSecurityVerification(true);
        } else {
          setVerificationAccepted(true);
        }

        setOrderVerificationSubmissionError(null);
      } catch ({
        response: {
          data: {
            error: { message },
          },
        },
      }) {
        console.log('ERROR: ', message);
        setOrderVerificationSubmissionError(message);
      }
    },
  });

  const securityFormik = useFormik({
    initialValues: {
      question: '',
      answer: '',
    },
    validationSchema: Yup.object({
      question: Yup.string().required('Required'),
      answer: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      console.log('Submit: ', values);
      const { answer, question } = values;
      try {
        await axios.post('/api/orders', {
          answer,
          claimed: true,
          orderNumber: formik.values.orderNumber,
          question,
          securityVerification: true,
        });
        setSecurityVerificationSubmissionError(null);
        setVerificationAccepted(true);
      } catch ({
        response: {
          data: {
            error: { message },
          },
        },
      }) {
        console.log('ERROR: ', message);
        setSecurityVerificationSubmissionError(message);
      }
    },
  });

  return (
    <div className="bg-primary">
      <Header logoOnly={true} />
      <main className="claim-nfts">
        <h1 className="claim-nfts__heading">
          {securityVerification && !verificationAccepted
            ? 'Security verification'
            : 'Order verification'}
        </h1>
        {!verificationAccepted && !securityVerification && (
          <OrderVerification
            error={orderVerificationSubmissionError}
            formik={formik}
          />
        )}
        {!verificationAccepted && securityVerification && (
          <SecurityVerification
            error={securityVerificationSubmissionError}
            formik={securityFormik}
          />
        )}
        {verificationAccepted && (
          <>
            <p className="claim-nfts__thank-you">
              Thank you for completing your NFT transaction!
            </p>
            <p className="claim-nfts__additional-info">
              Please check your wallet to make sure your NFTs have been
              successfully transferred.
              <br />
              This may take several minutes.
            </p>
            <Link href="/">
              <a className="claim-nfts__link link">
                Go to Fairytales & conspiracies
              </a>
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
