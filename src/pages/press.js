import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import Header from '@components/Header';

const Loading = () => {
  return <h1 className="press__page-heading">Loading...</h1>;
};

const PressLogin = () => {
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const logIn = async () => {
    const res = await signIn('credentials', { password, redirect: false });
    if (!res.ok) {
      setError('Incorrect password');
    } else {
      setError(null);
    }
  };

  return (
    <>
      <h1 className="press__page-heading">Press Area</h1>
      <div className="press__login-text">
        Welcome! Please enter the provided log in details in order to access
        press area.
      </div>
      <input
        className="input press__login-input"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        type="text"
        value={password}
      />
      <button
        className="btn btn--primary press__login-btn"
        onClick={logIn}
        type="button"
      >
        Log in
      </button>
      {error && <div className="error press__login-error">{error}</div>}
    </>
  );
};

const PressPage = () => {
  return (
    <>
      <h1 className="press__page-heading">Press Area</h1>
      <div className="press__top-section">
        <h2 className="press__heading press__heading--larger">Teaser Video</h2>
        <div className="press__top-section-main">
          <div className="press__teaser-video">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/aqz-KE-bpKQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="press__teaser-video-info">
            <div className="press__teaser-video-info-row">
              <h3 className="press__teaser-video-info-heading">
                Media Information
              </h3>
              <div className="press__docx-icon">
                <Image
                  alt="Document icon"
                  height="100%"
                  layout="responsive"
                  src="/img/docx.svg"
                  width="100%"
                />
              </div>
            </div>
            <div className="press__teaser-video-info-row">
              <h3 className="press__teaser-video-info-heading">
                Interview With Tobias Rehberger
              </h3>
              <div className="press__docx-icon">
                <Image
                  alt="Document icon"
                  height="100%"
                  layout="responsive"
                  src="/img/docx.svg"
                  width="100%"
                />
              </div>
            </div>
            <div className="press__teaser-video-btn-area">
              <button
                className="btn btn--quarternary press__teaser-video-btn"
                type="button"
              >
                <span className="press__teaser-video-btn-icon">
                  <Image
                    alt="Download"
                    height="20"
                    src="/img/icons/download.svg"
                    width="20"
                  />
                </span>
                Download
              </button>
              <button
                className="btn btn--quarternary press__teaser-video-btn"
                type="button"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
        <div className="press__media-contact-section">
          <h3 className="press__media-contact-heading">Media Contact</h3>
          <div className="press__media-contact-info">
            <div className="press__media-contact-info-row">
              krakom | Agentur für Public Relations
            </div>
            <div className="press__media-contact-info-row">
              Michael Schwengers
            </div>
            <div className="press__media-contact-info-row">+49 171 5428533</div>
          </div>
          <div className="press__media-contact-emails">
            <div className="press__media-contact-emails-row">
              michael.schwengers@krakom.de
            </div>
            <div className="press__media-contact-emails-row">or</div>
            <div className="press__media-contact-emails-row">
              press@fairytalesandconspiracies.art
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn btn--primary press__login-btn"
        onClick={signOut}
        type="button"
      >
        Sign out
      </button>
    </>
  );
};

export default function Press() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-primary">
      <Header logoOnly />
      <main className="press">
        {status === 'loading' && <Loading />}
        {status !== 'loading' && !session && <PressLogin />}
        {status !== 'loading' && session && <PressPage />}
      </main>
    </div>
  );
}
