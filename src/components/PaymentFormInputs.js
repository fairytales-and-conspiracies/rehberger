import { useContext } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import ShoppingCartContext from '@context/ShoppingCartContext';

export default function PaymentFormInputs({ formik }) {
  const { selectedFrames } = useContext(ShoppingCartContext);
  return (
    <>
      <h2 className="payment-form__heading">Shipping information</h2>
      <p className="payment-form__text">
        Your personal information will be stored and used solely for shipping
        and delivery purposes
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-container">
          <input
            className="input"
            disabled={!selectedFrames.length}
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
            className="input"
            disabled={!selectedFrames.length}
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
            className="input"
            disabled={!selectedFrames.length}
            id="email"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Email *"
            type="text"
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="error">{formik.errors.email}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="addressLine1"
            name="addressLine1"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Address line 1 *"
            type="text"
            value={formik.values.addressLine1}
          />
          {formik.touched.addressLine1 && formik.errors.addressLine1 ? (
            <p className="error">{formik.errors.addressLine1}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="addressLine2"
            name="addressLine2"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Address line 2"
            type="text"
            value={formik.values.addressLine2}
          />
          {formik.touched.addressLine2 && formik.errors.addressLine2 ? (
            <p className="error">{formik.errors.addressLine2}</p>
          ) : null}
          <CountryDropdown
            className={`input ${
              formik.values.country ? '' : 'input--grey-text'
            }`}
            defaultOptionLabel="Country *"
            disabled={!selectedFrames.length}
            id="country"
            name="country"
            onBlur={() => formik.setFieldTouched('country', true)}
            onChange={(value) => formik.setFieldValue('country', value)}
            type="text"
            value={formik.values.country}
          />
          {formik.touched.country && formik.errors.country ? (
            <p className="error">{formik.errors.country}</p>
          ) : null}
          <RegionDropdown
            blankOptionLabel="State / Province"
            className={`input ${
              formik.values.country && formik.values.region
                ? ''
                : 'input--grey-text'
            }`}
            country={formik.values.country}
            defaultOptionLabel="State / Province"
            disabled={!selectedFrames.length}
            id="region"
            name="region"
            onBlur={() => formik.setFieldTouched('region', true)}
            onChange={(value) => formik.setFieldValue('region', value)}
            type="text"
            value={formik.values.region}
          />
          {formik.touched.region && formik.errors.region ? (
            <p className="error">{formik.errors.region}</p>
          ) : null}
          <input
            className="input"
            id="city"
            disabled={!selectedFrames.length}
            name="city"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="City *"
            type="text"
            value={formik.values.city}
          />
          {formik.touched.city && formik.errors.city ? (
            <p className="error">{formik.errors.city}</p>
          ) : null}
          <input
            className="input"
            id="postalCode"
            disabled={!selectedFrames.length}
            name="postalCode"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Postal code *"
            type="text"
            value={formik.values.postalCode}
          />
          {formik.touched.postalCode && formik.errors.postalCode ? (
            <p className="error">{formik.errors.postalCode}</p>
          ) : null}
          <button
            className="btn btn--primary"
            disabled={!selectedFrames.length}
            type="submit"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
