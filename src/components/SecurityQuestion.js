import { useContext } from 'react';

import PaymentContext from '@/context/PaymentContext';
import securityQuestionOptions from '@/static-data/security-question-options';

export default function SecurityQuestion() {
  const { securityQuestionFormik: formik } = useContext(PaymentContext);

  return (
    <>
      <h2 className="payment-form__heading">Security question</h2>
      <p className="payment-form__text">
        Please choose a security question from the options below.
      </p>
      <div className="security-question">
        <p className="security-question__info">
          In order to make sure your NFTs get to you safely once your purchase
          is complete, we ask you to select a security question that only you
          know the answer to. That way we will be sure that the NFTs are going
          into the right hands!
        </p>
        <form
          className="security-question__form"
          onSubmit={formik.handleSubmit}
        >
          <select
            className="security-question__input input"
            disabled={formik.values.noSecurityQuestion}
            id="question"
            name="question"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.question}
          >
            <option value={null}>Choose a security question</option>
            {securityQuestionOptions.map((question) => (
              <option key={question} value={question}>
                {question}
              </option>
            ))}
          </select>
          {formik.touched.question && formik.errors.question ? (
            <p className="error">{formik.errors.question}</p>
          ) : null}
          <input
            className="security-question__input input"
            disabled={formik.values.noSecurityQuestion}
            id="answer"
            name="answer"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Answer"
            value={formik.values.answer}
          />
          {formik.touched.answer && formik.errors.answer ? (
            <p className="error">{formik.errors.answer}</p>
          ) : null}
          <div className="security-question__input">
            <label
              className="security-question__label"
              htmlFor="noSecurityQuestion"
            >
              <input
                id="noSecurityQuestion"
                name="noSecurityQuestion"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="checkbox"
                value={formik.values.noSecurityQuestion}
              />{' '}
              I don’t want a security question
            </label>
          </div>
          <button className="btn btn--primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
