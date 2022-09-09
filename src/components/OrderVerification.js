export default function OrderVerification({ error, formik }) {
  return (
    <>
      <p className="order-verification__welcome-back">
        Welcome back! Please enter the information below so we can transfer your
        NFTs to your wallet address.
      </p>
      <form className="order-verification__form" onSubmit={formik.handleSubmit}>
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
          placeholder="Order no. *"
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
          type="submit"
        >
          Continue
        </button>
        <p className="order-verification__submit-error">{error}</p>
      </form>
    </>
  );
}
