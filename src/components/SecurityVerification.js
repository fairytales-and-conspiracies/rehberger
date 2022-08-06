import { useState } from 'react';

import IdentityVerification from '@components/IdentityVerification';

export default function SecurityVerification({ error, formik }) {
  const [isIdentityVerificationVisible, setIsIdentityVerificationVisible] =
    useState(false);

  return (
    <>
      <p className="security-verification__info">
        Please enter the correct answer to the security question you have chosen
        in order to complete the NFT transfer. Your NFTs will be sent to your
        wallet address shortly.
      </p>
      <form
        className="security-verification__form"
        onSubmit={formik.handleSubmit}
      >
        <input
          className="security-verification__input input"
          disabled
          id="question"
          name="question"
          onChange={formik.handleChange}
          value={formik.values.question}
        />
        {formik.touched.question && formik.errors.question ? (
          <p className="error">{formik.errors.question}</p>
        ) : null}
        <input
          className="security-verification__input input"
          id="answer"
          name="answer"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Answer *"
          value={formik.values.answer}
        />
        {formik.touched.answer && formik.errors.answer ? (
          <p className="error">{formik.errors.answer}</p>
        ) : null}
        <button
          className="security-verification__btn btn btn--primary"
          type="submit"
        >
          Submit
        </button>
      </form>
      <p className="security-verification__submit-error">{error}</p>
      <p
        className="security-verification__cannot-remember link"
        onClick={() => {
          setIsIdentityVerificationVisible(true);
        }}
      >
        Can't remember the correct answer?
      </p>
      <IdentityVerification
        isVisible={isIdentityVerificationVisible}
        setIsVisible={setIsIdentityVerificationVisible}
      />
    </>
  );
}
