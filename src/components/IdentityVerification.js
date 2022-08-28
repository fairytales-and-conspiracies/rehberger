import axios from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import * as Yup from 'yup';

const REQUIRED_NUMBER_OF_FILES = 2;

export default function IdentityVerification({ isVisible, setIsVisible }) {
  const [submissionError, setSubmissionError] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const formik = useFormik({
    initialValues: {
      files: null,
      orderNumber: '',
      walletAddress: '',
    },
    validationSchema: Yup.object({
      files: Yup.mixed()
        .test(
          'areTwoFilesAttached',
          'Two files required - front and back side',
          (value) => {
            return !!value && value.length === REQUIRED_NUMBER_OF_FILES;
          }
        )
        .test('fileSize', 'File file is too large', (value) => {
          return !value || (value.length > 0 && value[0].size <= 5000000);
        })
        .test('fileSize', 'Second file is too large', (value) => {
          return !value || (value.length > 1 && value[1].size <= 5000000);
        }),
      orderNumber: Yup.string().required('Required'),
      walletAddress: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      console.log('Submit: ', values);
      const formData = new FormData();
      formData.append('files', values.files[0]);
      formData.append('files', values.files[1]);
      formData.append('orderNumber', values.orderNumber);
      formData.append('walletAddress', values.walletAddress);
      try {
        await axios.post('/api/identity-verification', formData, {
          headers: {},
        });
        setSubmissionError(null);
        setShowThankYou(true);
      } catch ({
        response: {
          data: {
            error: { message },
          },
        },
      }) {
        setSubmissionError(message);
      }
    },
  });

  return (
    <div
      className={`identity-verification ${
        isVisible ? 'identity-verification--visible' : ''
      }`}
    >
      <div className="identity-verification__backdrop">
        <div className="identity-verification__main">
          <span className="identity-verification__close">
            <Image
              alt="Close"
              height="25"
              onClick={() => setIsVisible(false)}
              src="/img/icons/close.svg"
              width="25"
            />
          </span>
          {!showThankYou && (
            <>
              <h4 className="identity-verification__heading">
                Can’t remember the correct answer to your chosen security
                question?
              </h4>
              <p className="identity-verification__info">
                In order to complete the transaction of your purchased NFTs and
                have them transferred to your wallet safely, you will need to
                provide some legal document so we could match your provided
                information and verify your identity.
              </p>
              <p className="identity-verification__info">
                Please attach the photo of both the front and back side of a
                peferred legal document, such as national ID, passport or
                driver’s licence.
              </p>
              <form
                className="identity-verification__form"
                onSubmit={formik.handleSubmit}
              >
                {(!formik.values.files ||
                  formik.values.files.length < REQUIRED_NUMBER_OF_FILES) && (
                  <button
                    className="identity-verification__file-input-overlay btn btn--quarternary btn--small"
                    type="button"
                  >
                    Add attachment
                    <input
                      className="identity-verification__file-input"
                      id="files"
                      name="files"
                      multiple
                      onChange={(e) => {
                        console.log('FILES: ', e.currentTarget.files);
                        formik.setFieldTouched('files', true);
                        const files = Array.from(
                          formik.values.files || []
                        ).concat(Array.from(e.currentTarget.files));

                        if (files.length <= REQUIRED_NUMBER_OF_FILES) {
                          formik.setFieldValue('files', [...files]);
                        }
                      }}
                      type="file"
                    />
                  </button>
                )}
                {formik.values.files &&
                  formik.values.files.map((file, index) => (
                    <div
                      className="identity-verification__chosen-file"
                      key={index}
                    >
                      <p className="identity-verification__chosen-file-name">
                        {file.name}
                      </p>
                      <span className="identity-verification__chosen-file-cancel">
                        <Image
                          alt="Remove file"
                          height="20"
                          onClick={() => {
                            const { files } = formik.values;
                            files.splice(index, 1);
                            formik.setFieldValue(`files`, files);
                          }}
                          src="/img/icons/close.svg"
                          width="20"
                        />
                      </span>
                    </div>
                  ))}
                {formik.touched.files && formik.errors.files ? (
                  <p className="identity-verification__error error">
                    {formik.errors.files}
                  </p>
                ) : null}
                <input
                  className="identity-verification__input input"
                  id="orderNumber"
                  name="orderNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Confirmation Key *"
                  value={formik.values.orderNumber}
                />
                {formik.touched.orderNumber && formik.errors.orderNumber ? (
                  <p className="identity-verification__error error">
                    {formik.errors.orderNumber}
                  </p>
                ) : null}
                <input
                  className="identity-verification__input input"
                  id="walletAddress"
                  name="walletAddress"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Wallet Address *"
                  value={formik.values.walletAddress}
                />
                {formik.touched.walletAddress && formik.errors.walletAddress ? (
                  <p className="identity-verification__error error">
                    {formik.errors.walletAddress}
                  </p>
                ) : null}
                <button
                  className="identity-verification__submit-btn btn btn--primary"
                  type="submit"
                >
                  Send
                </button>
                <p className="identity-verification__submit-error">
                  {submissionError}
                </p>
                <button
                  className="identity-verification__cancel btn btn--link"
                  onClick={() => setIsVisible(false)}
                  type="button"
                >
                  Cancel
                </button>
              </form>
            </>
          )}
          {showThankYou && (
            <>
              <h4
                className={
                  'identity-verification__heading ' +
                  'identity-verification__heading--thank-you'
                }
              >
                Thank you for submitting your identity verification document!
              </h4>
              <p className="identity-verification__info text-center">
                Once we match the sent document to the information you provided
                earlier and verify your identity, you will receive an email
                whith the answer you provided to the chosen security question.
                Use this information to complete the transfer of your purchased
                NFT’s and once you complete the process, your NFTs will be
                safely transferred to your wallet’s address.
              </p>
              <p className="identity-verification__info text-center">
                In case things are not in order, please contact us via email
                fairytalesandconspiracies@gmail.com
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
