import { useContext, useEffect } from 'react';

import ConnectWalletButton from '@/components/ConnectWalletButton';
import Web3Context from '@/context/Web3Context';

export default function OrderVerification({ error, formik }) {
  const { address } = useContext(Web3Context);

  useEffect(() => {
    formik.setFieldValue('walletAddress', address);
  }, [address]);

  return (
    <>
      <p className="order-verification__welcome-back">
        Welcome back! Please enter the information below so we can transfer your
        NFTs to your wallet address. Make sure your wallet address is correct,
        as the NFTs will be transferred to that address directly, and then click
        “Submit”.
      </p>
      <p className="order-verification__welcome-back">
        You can connect your wallet using the “Connect Wallet” button and the
        address will be entered automatically or you can enter your address
        manually. If you need to disconnect your wallet for any reason, you can
        click on the same button again.
      </p>
      <form className="order-verification__form" onSubmit={formik.handleSubmit}>
        <ConnectWalletButton className="order-verification__btn" />
        <input
          className="order-verification__input input"
          id="firstName"
          name="firstName"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="First name *"
          type="text"
          value={formik.values.firstName}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <p className="error">{formik.errors.firstName}</p>
        ) : null}
        <input
          className="order-verification__input input"
          id="lastName"
          name="lastName"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Last name *"
          type="text"
          value={formik.values.lastName}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <p className="error">{formik.errors.lastName}</p>
        ) : null}
        <input
          className="order-verification__input input"
          id="confirmationKey"
          name="confirmationKey"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Confirmation key *"
          type="text"
          value={formik.values.confirmationKey}
        />
        {formik.touched.confirmationKey && formik.errors.confirmationKey ? (
          <p className="error">{formik.errors.confirmationKey}</p>
        ) : null}
        <input
          className="order-verification__input input"
          id="walletAddress"
          name="walletAddress"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Wallet address *"
          type="text"
          value={formik.values.walletAddress}
        />
        {formik.touched.walletAddress && formik.errors.walletAddress ? (
          <p className="error">{formik.errors.walletAddress}</p>
        ) : null}
        <button
          className="order-verification__btn btn btn--primary"
          disabled={formik.isSubmitting}
          type="submit"
        >
          {formik.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <p className="order-verification__submit-error">{error}</p>
      </form>
    </>
  );
}
