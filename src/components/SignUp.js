import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

const SignUp = ({ className, isJoinCommunity, signUpText }) => {
  const [signupError, setSignupError] = useState(false);
  const [signupSuccessful, setSignupSuccessful] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Required'),
    }),
    onSubmit: async ({ email }) => {
      try {
        await axios.post('/api/sign-up', { email });
        setSignupSuccessful(true);
      } catch (err) {
        setSignupError(true);
      }
    },
  });

  useEffect(() => {
    if (signupError) {
      setTimeout(() => {
        setSignupError(false);
      }, 10000);
    }
  }, [signupError]);

  useEffect(() => {
    if (signupSuccessful) {
      setTimeout(() => {
        setSignupSuccessful(false);
      }, 10000);
    }
  }, [signupSuccessful]);

  const onSignupClick = () => {
    if (!formik.isSubmitting) {
      setSignupSuccessful(false);
      setSignupError(false);
    }
  };

  if (formik.touched.email && formik.errors.email && signupSuccessful) {
    setSignupSuccessful(false);
  }

  if (formik.touched.email && formik.errors.email && signupError) {
    setSignupError(false);
  }

  const shouldInputHaveMarginBottom =
    !signupError &&
    !signupSuccessful &&
    !(formik.touched.email && formik.errors.email);

  return (
    <div className={`sign-up ${className ? `${className}__sign-up` : ''}`}>
      <p
        className={`sign-up__text ${
          className ? `${className}__sign-up-text` : ''
        }`}
      >
        {signUpText}
      </p>
      <form
        className={`sign-up__form ${
          isJoinCommunity ? 'sign-up__form--flex-column' : ''
        }`}
        onSubmit={formik.handleSubmit}
      >
        <div
          className={`sign-up__input-and-error ${
            className ? `${className}__sign-up-input-and-error` : ''
          }`}
        >
          <input
            className={`input sign-up__input ${
              shouldInputHaveMarginBottom ? 'sign-up__input--bottom-space' : ''
            } ${className ? `${className}__sign-up-input` : ''}`}
            name="email"
            onChange={formik.handleChange}
            placeholder="Email"
            type="text"
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error sign-up__error">{formik.errors.email}</p>
          )}
          {signupSuccessful && (
            <p className="sign-up__success">Thank you for signing up!</p>
          )}
          {signupError && (
            <p className="error sign-up__error">There has been an error!</p>
          )}
        </div>
        <button
          className={`btn btn--primary sign-up__btn  ${
            className ? `${className}__sign-up-btn` : ''
          }`}
          disabled={formik.isSubmitting || undefined}
          onClick={onSignupClick}
          type="submit"
        >
          {formik.isSubmitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
