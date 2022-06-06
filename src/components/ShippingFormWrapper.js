import { useWeb3 } from '@3rdweb/hooks';
import axios from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';

import ShippingFormInfo from '@components/ShippingFormInfo';
import ShippingFormInputs from '@components/ShippingFormInputs';
import ShoppingCartContext from '@context/ShoppingCartContext';
import { address as contractAddress, abi } from '@contract/exampleContract';
import CountriesWithProvinces from '@static-data/countries-with-provinces';
import { web3Metamask } from '@utils/web3';

export default function ShippingFormWrapper() {
  const ADDRESS_FROM = process.env.NEXT_PUBLIC_ADDRESS_FROM;

  const { address } = useWeb3();

  const { selectedFrames } = useContext(ShoppingCartContext);

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactionPassed, setTransactionPassed] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (!!address) {
      const web3 = web3Metamask();
      setWeb3(web3);

      const contract = new web3.eth.Contract(abi, contractAddress);
      setContract(contract);
    }
  }, [address]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      region: '',
      city: '',
      postalCode: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(25, 'Must be 25 characters or less')
        .required('Required'),
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
      setFormSubmitted(true);
    },
  });

  const confirm = async (values) => {
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
    try {
      const checkoutCall = await axios.post('/api/checkout', selectedFrames);
      const url = checkoutCall.data.url;
      window.location = url;
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  return (
    <div className="shipping-form">
      <h2 className="shipping-form__heading">
        {!formSubmitted ? 'Shipping information' : 'Confirmation'}
      </h2>
      <p className="shipping-form__text">
        Your personal information will be stored and used solely for shipping
        and delivery purposes
      </p>
      {!formSubmitted && <ShippingFormInputs formik={formik} />}
      {formSubmitted && (
        <ShippingFormInfo
          confirm={confirm}
          setTransactionPassed={setTransactionPassed}
          transactionPassed={transactionPassed}
          values={formik.values}
          walletConnected={!!address}
        />
      )}
      <button className="btn btn--secondary" onClick={onPayWithStripeClick}>
        Pay with Stripe
      </button>
    </div>
  );
}
