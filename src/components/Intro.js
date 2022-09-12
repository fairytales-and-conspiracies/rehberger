import axios from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import * as Yup from 'yup';

import CountdownTimer from '@/components/CountdownTimer';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function Home() {
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
        // TODO: LOG
      }
    },
  });

  const onSignupClick = () => {
    setSignupSuccessful(false);
  };

  if (formik.touched.email && formik.errors.email && signupSuccessful) {
    setSignupSuccessful(false);
  }

  const shouldInputHaveMarginBottom =
    !signupSuccessful && !(formik.touched.email && formik.errors.email);

  return (
    <div className={`bg-home${INTERIM ? ' bg-home--interim' : ''}`}>
      <div
        className={`bg-home__overlay${
          INTERIM ? ' bg-home__overlay--interim' : ''
        }`}
      >
        <section className="home" id="home">
          <CountdownTimer />
          <div className="home__website-title">
            <span className="home__website-title-layer">
              Fairytales & conspiracies
            </span>
            <span className="home__website-title-layer">
              Fairytales & conspiracies
            </span>
            <span className="home__website-title-layer">
              Fairytales & conspiracies
            </span>
          </div>
          <div className="home__red-strip">
            <div className="home__artist-info-wrapper">
              <div className="home__by-artist-info">
                by <br className="max-screen-sm-hidden" />
                Tobias <br className="max-screen-sm-hidden" />
                Rehberger
              </div>
              <p className="home__artist-statement">
                “With my blockchain based edition “Fairytales & Conspiracies”, I
                wanted to create NFTs that are more than digitally certified
                artworks. My objective was to make conceptual use of this new
                technology within the framework of references that I have built
                over the span of my career. The result brings together the new
                world of purely digital NFTs with the tangible, old world of
                fine art prints to discuss questions related to authorship,
                originality, ownership and what constitutes an artwork. Each NFT
                consists of a liquid poster, whose single elements are
                solidified by selecting an individual artwork, which is then
                also delivered as a fine art digital print. I created the motifs
                from the huge image archive of action press.”
              </p>
            </div>
          </div>
          <div className="home__community">
            <div className="home__sign-up">
              <p className="home__sign-up-text">
                Sign up for updates and information about Fairytales &
                Conspiracies.
              </p>
              <form
                className="home__sign-up-form"
                onSubmit={formik.handleSubmit}
              >
                <div className="home__sign-up-input-and-error">
                  <input
                    className={`input home__sign-up-input ${
                      shouldInputHaveMarginBottom
                        ? 'home__sign-up-input--bottom-space'
                        : ''
                    }`}
                    name="email"
                    onChange={formik.handleChange}
                    placeholder="Email"
                    type="text"
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="error home__sign-up-error">
                      {formik.errors.email}
                    </p>
                  )}
                  {signupSuccessful && (
                    <p className="home__sign-up-success">
                      Thank you for signing up!
                    </p>
                  )}
                </div>
                <button
                  className="btn btn--primary home__sign-up-btn"
                  onClick={onSignupClick}
                  type="submit"
                >
                  Sign up
                </button>
              </form>
            </div>
            <div className="home__community-separator" />
            <div className="home__socials-wrapper">
              <div className="home__socials-text">
                Or follow us on social media.
              </div>
              <div className="home__socials">
                <span className="home__social-link">
                  <a
                    href="https://twitter.com/fairytalesandc"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt="Rehberger Twitter"
                      height="100%"
                      layout="responsive"
                      src="/img/icons/twitter.svg"
                      width="100%"
                    />
                  </a>
                </span>
                <span className="home__social-link">
                  <a
                    href="https://www.instagram.com/fairytalesandconspiracies/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt="Rehberger Instagram"
                      height="100%"
                      layout="responsive"
                      src="/img/icons/instagram.svg"
                      width="100%"
                    />
                  </a>
                </span>
                <span className="home__social-link">
                  <a
                    href="https://t.co/QI165OgqjF"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt="Rehberger Discord"
                      height="100%"
                      layout="responsive"
                      src="/img/icons/discord.svg"
                      width="100%"
                    />
                  </a>
                </span>
                <span className="home__social-link">
                  <a
                    href="https://t.me/fairytalesandconspiracies"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt="Rehberger Telegram"
                      height="100%"
                      layout="responsive"
                      src="/img/icons/telegram.svg"
                      width="100%"
                    />
                  </a>
                </span>
                <span className="home__social-link">
                  <a
                    href="https://www.facebook.com/profile.php?id=100085234524658"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt="Rehberger Facebook"
                      height="100%"
                      layout="responsive"
                      src="/img/icons/facebook.svg"
                      width="100%"
                    />
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
