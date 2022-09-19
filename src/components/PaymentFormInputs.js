import { useContext } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import PaymentContext from '@/context/PaymentContext';
import ShoppingCartContext from '@/context/ShoppingCartContext';

export default function PaymentFormInputs() {
  const { infoFormik } = useContext(PaymentContext);
  const { selectedFrames } = useContext(ShoppingCartContext);

  return (
    <>
      <h2 className="payment-form__heading">Shipping information</h2>
      <p className="payment-form__text">
        Your personal information will be stored and used solely for shipping
        and delivery purposes
      </p>
      <form onSubmit={infoFormik.handleSubmit}>
        <div className="form-container">
          <input
            className="input"
            disabled={false}
            id="company"
            name="company"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="Company"
            type="text"
            value={infoFormik.values.company}
          />
          {infoFormik.touched.company && infoFormik.errors.company ? (
            <p className="error">{infoFormik.errors.company}</p>
          ) : null}
          <input
            className="input"
            disabled={false}
            id="vatNo"
            name="vatNo"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="VAT No."
            type="text"
            value={infoFormik.values.vatNo}
          />
          {infoFormik.touched.vatNo && infoFormik.errors.vatNo ? (
            <p className="error">{infoFormik.errors.vatNo}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="firstName"
            name="firstName"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="First name *"
            type="text"
            value={infoFormik.values.firstName}
          />
          {infoFormik.touched.firstName && infoFormik.errors.firstName ? (
            <p className="error">{infoFormik.errors.firstName}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="lastName"
            name="lastName"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="Last name *"
            type="text"
            value={infoFormik.values.lastName}
          />
          {infoFormik.touched.lastName && infoFormik.errors.lastName ? (
            <p className="error">{infoFormik.errors.lastName}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="email"
            name="email"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="Email *"
            type="text"
            value={infoFormik.values.email}
          />
          {infoFormik.touched.email && infoFormik.errors.email ? (
            <p className="error">{infoFormik.errors.email}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="addressLine1"
            name="addressLine1"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="Address line 1 *"
            type="text"
            value={infoFormik.values.addressLine1}
          />
          {infoFormik.touched.addressLine1 && infoFormik.errors.addressLine1 ? (
            <p className="error">{infoFormik.errors.addressLine1}</p>
          ) : null}
          <input
            className="input"
            disabled={!selectedFrames.length}
            id="addressLine2"
            name="addressLine2"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="Address line 2"
            type="text"
            value={infoFormik.values.addressLine2}
          />
          {infoFormik.touched.addressLine2 && infoFormik.errors.addressLine2 ? (
            <p className="error">{infoFormik.errors.addressLine2}</p>
          ) : null}
          <CountryDropdown
            className={`input ${
              infoFormik.values.country ? '' : 'input--grey-text'
            }`}
            defaultOptionLabel="Country *"
            disabled={!selectedFrames.length}
            id="country"
            name="country"
            onBlur={() => infoFormik.setFieldTouched('country', true)}
            onChange={(value) => infoFormik.setFieldValue('country', value)}
            type="text"
            value={infoFormik.values.country}
          />
          {infoFormik.touched.country && infoFormik.errors.country ? (
            <p className="error">{infoFormik.errors.country}</p>
          ) : null}
          <RegionDropdown
            blankOptionLabel="State / Province"
            className={`input ${
              infoFormik.values.country && infoFormik.values.region
                ? ''
                : 'input--grey-text'
            }`}
            country={infoFormik.values.country}
            defaultOptionLabel="State / Province"
            disabled={!selectedFrames.length}
            id="region"
            name="region"
            onBlur={() => infoFormik.setFieldTouched('region', true)}
            onChange={(value) => infoFormik.setFieldValue('region', value)}
            type="text"
            value={infoFormik.values.region}
          />
          {infoFormik.touched.region && infoFormik.errors.region ? (
            <p className="error">{infoFormik.errors.region}</p>
          ) : null}
          <input
            className="input"
            id="city"
            disabled={!selectedFrames.length}
            name="city"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="City *"
            type="text"
            value={infoFormik.values.city}
          />
          {infoFormik.touched.city && infoFormik.errors.city ? (
            <p className="error">{infoFormik.errors.city}</p>
          ) : null}
          <input
            className="input"
            id="postalCode"
            disabled={!selectedFrames.length}
            name="postalCode"
            onBlur={infoFormik.handleBlur}
            onChange={infoFormik.handleChange}
            placeholder="Postal code *"
            type="text"
            value={infoFormik.values.postalCode}
          />
          {infoFormik.touched.postalCode && infoFormik.errors.postalCode ? (
            <p className="error">{infoFormik.errors.postalCode}</p>
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
