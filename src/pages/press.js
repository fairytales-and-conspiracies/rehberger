import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import { onEnterPress } from '@/utils/keypress';
import download from '@/utils/download';

const TEASER_VIDEO_LINK = '/vid/NFT_TEASER_SUBTITLE.mp4';
const TEASER_VIDEO_YOUTUBE = 'https://www.youtube.com/embed/eZ0ydV252ZI';
const TEASER_VIDEO_YOUTUBE_LINK = 'https://youtu.be/eZ0ydV252ZI';

const LIQUID_POSTER_1 = 'HAVEYOUEVERTHOUGHOFEMIGRATING?';
const LIQUID_POSTER_1_LINK = '/vid/HAVEYOUEVERTHOUGHOFEMIGRATING?.mov';
const LIQUID_POSTER_1_YOUTUBE = 'https://youtube.com/embed/U3IRKY7QJXc';
const LIQUID_POSTER_1_YOUTUBE_LINK = 'https://youtube.com/shorts/U3IRKY7QJXc';

const LIQUID_POSTER_2 = 'IMAGINEYOURSELFWITHOUTAHOME';
const LIQUID_POSTER_2_LINK = '/img/press/liquid-poster-2-unavailable.svg';

const LIQUID_POSTER_3 = 'HAVEYOUEVERSTOLENANIDEA?';
const LIQUID_POSTER_3_LINK = '/img/press/liquid-poster-3-unavailable.svg';

const LIQUID_POSTER_4 = 'AREYOUAFRAIDOFTHEPOOR?';
const LIQUID_POSTER_4_LINK = '/img/press/liquid-poster-4-unavailable.svg';

const LIQUID_POSTER_5 = 'ANYTHINGTHATINDICATESYOUHAVEASENSEOFHUMOR';
const LIQUID_POSTER_5_LINK = '/img/press/liquid-poster-5-unavailable.svg';

const IMAGE_1_LINK =
  '/img/press/01_Tobias_Rehberger_Liquid_Poster_Detail_1.jpg';
const IMAGE_2_LINK =
  '/img/press/02_Tobias_Rehberger_Liquid_Poster_Detail_2.jpg';
const IMAGE_3_LINK =
  '/img/press/03_Tobias_Rehberger_Liquid_Poster_Detail_3.jpg';
const IMAGE_4_LINK =
  '/img/press/04_Tobias_Rehberger_Liquid_Poster_Detail_4.jpg';
const IMAGE_5_LINK =
  '/img/press/05_Tobias_Rehberger_Liquid_Poster_Detail_5.jpg';
const IMAGE_6_LINK =
  '/img/press/06_Tobias_Rehberger_Liquid_Poster_Detail_6.jpg';
const IMAGE_7_LINK =
  '/img/press/07_Tobias_Rehberger_Liquid_Poster_Detail_7.jpg';
const IMAGE_8_LINK =
  '/img/press/08_Tobias_Rehberger_Portrait_In_Landscape_Format.jpg';
const IMAGE_9_LINK =
  '/img/press/09_Tobias_Rehberger_Portrait_In_Portrait_Format.jpg';
const IMAGE_10_LINK =
  '/img/press/10_Tobias_Rehberger_Kunstmuseum_Stuttgart_Facade_Installation.jpg';
const IMAGE_11_LINK =
  '/img/press/11_Tobias_Rehberger_Installation_I_Do_If_I_Don_t.jpg';
const IMAGE_12_LINK =
  '/img/press/12_Tobias_Rehberger_Was_Du_Liebst_Bringt_Dich_Auch_Zum_Weinen.jpg';

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
        onKeyPress={onEnterPress(logIn)}
        placeholder="Password"
        type="password"
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

const PressLiquidPoster = ({
  available,
  link,
  name,
  posterNumber,
  youtube,
  youtubeLink,
}) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = (copiedLink) => {
    navigator.clipboard.writeText(copiedLink);
    setLinkCopied(true);
  };

  useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied]);

  return (
    <div
      className={`press__liquid-poster ${
        available ? '' : 'press__liquid-poster--unavailable'
      }`}
    >
      <div className="press__liquid-poster-video">
        {available && (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="press__liquid-poster-iframe"
            frameBorder="0"
            height="225"
            src={youtube}
            title="YouTube video player"
            width="400"
          />
        )}
        {!available && (
          <>
            <Image
              alt={name}
              height="225"
              layout="responsive"
              src={link}
              width="400"
            />
            <div className="press__liquid-poster-unavailable-text">
              Coming Soon
            </div>
          </>
        )}
      </div>
      <div className="press__liquid-poster-info-section">
        <div className="press__liquid-poster-info">
          <div className="press__liquid-poster-name">{name}</div>
          <div className="press__liquid-poster-number">
            Liquid Poster No. {posterNumber}
          </div>
        </div>
        <div className="press__liquid-poster-btn-area">
          <button
            className={`btn btn--quarternary press__liquid-poster-btn press__liquid-poster-btn--download ${
              available ? '' : 'press__liquid-poster-btn--unavailable'
            }`}
            onClick={available ? () => download(link, name, 'mov') : null}
            type="button"
          >
            <span className="press__btn-icon">
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
            </span>
            Download
          </button>
          <div className="press__liquid-poster-copy-btn-container">
            {linkCopied && (
              <div className="press__liquid-poster-link-copied-text">
                Link Copied
              </div>
            )}
            <button
              className={`btn btn--quarternary press__liquid-poster-btn ${
                available ? '' : 'press__liquid-poster-btn--unavailable'
              }`}
              onClick={available ? () => copyLink(youtubeLink) : null}
              type="button"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PressPage = () => {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
  };

  useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied]);

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
              src={TEASER_VIDEO_YOUTUBE}
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
              <div className="press__teaser-video-info-docs-section">
                <div className="press__teaser-video-doc-group">
                  <div className="press__teaser-video-info-language">
                    English:
                  </div>
                  <div className="press__teaser-video-info-docs">
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Media Information"
                      href="/doc/Media_Information_Tobias_Rehberger_ENGLISH.docx"
                    >
                      DOCX
                    </a>
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Media Information"
                      href="/doc/Media_Information_Tobias_Rehberger_ENGLISH.pdf"
                    >
                      PDF
                    </a>
                  </div>
                </div>
                <div className="press__teaser-video-doc-group">
                  <div className="press__teaser-video-info-language">
                    German:
                  </div>
                  <div className="press__teaser-video-info-docs">
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Medieninformation"
                      href="/doc/Medieninformation_Tobias_Rehberger_DEUTSCH.docx"
                    >
                      DOCX
                    </a>
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Medieninformation"
                      href="/doc/Medieninformation_Tobias_Rehberger_DEUTSCH.pdf"
                    >
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="press__teaser-video-info-row">
              <h3 className="press__teaser-video-info-heading">
                Interview With Tobias Rehberger
              </h3>
              <div className="press__teaser-video-info-docs-section">
                <div className="press__teaser-video-doc-group">
                  <div className="press__teaser-video-info-language">
                    English:
                  </div>
                  <div className="press__teaser-video-info-docs">
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Interview"
                      href="/doc/Interview_Tobias_Rehberger_ENGLISH.docx"
                    >
                      DOCX
                    </a>
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Interview"
                      href="/doc/Interview_Tobias_Rehberger_ENGLISH.pdf"
                    >
                      PDF
                    </a>
                  </div>
                </div>
                <div className="press__teaser-video-doc-group">
                  <div className="press__teaser-video-info-language">
                    German:
                  </div>
                  <div className="press__teaser-video-info-docs">
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Interview"
                      href="/doc/Interview_Tobias_Rehberger_DEUTSCH.docx"
                    >
                      DOCX
                    </a>
                    <a
                      className="press__teaser-video-info-doc link link--purple"
                      download="Tobias Rehberger Interview"
                      href="/doc/Interview_Tobias_Rehberger_DEUTSCH.pdf"
                    >
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="press__teaser-video-btn-area">
              <button
                className="btn btn--quarternary press__teaser-video-btn"
                onClick={() =>
                  download(TEASER_VIDEO_LINK, 'Teaser Video', 'mp4')
                }
                type="button"
              >
                <span className="press__btn-icon">
                  <Image
                    alt="Download"
                    height="15"
                    src="/img/icons/download.svg"
                    width="15"
                  />
                </span>
                Download
              </button>
              <div className="press__teaser-video-copy-btn-container">
                {linkCopied && (
                  <div className="press__teaser-video-link-copied-text">
                    Link Copied
                  </div>
                )}
                <button
                  className="btn btn--quarternary press__teaser-video-btn"
                  onClick={() => {
                    copyLink(TEASER_VIDEO_YOUTUBE_LINK);
                  }}
                  type="button"
                >
                  Copy Link
                </button>
              </div>
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

      <div className="press__social-media-section">
        <h2 className="press__heading press__heading--larger">Social Media</h2>
      </div>
      <div className="press__socials">
        <span className="press__social-link">
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
        <span className="press__social-link">
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
        <span className="press__social-link">
          <a href="https://t.co/QI165OgqjF" rel="noreferrer" target="_blank">
            <Image
              alt="Rehberger Discord"
              height="100%"
              layout="responsive"
              src="/img/icons/discord.svg"
              width="100%"
            />
          </a>
        </span>
        <span className="press__social-link">
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
        <span className="press__social-link">
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

      <div className="press__liquid-poster-section">
        <h2 className="press__heading press__heading--larger">
          Liquid Posters
        </h2>
        <div className="press__liquid-posters">
          <div className="press__liquid-posters-row">
            <PressLiquidPoster
              available
              link={LIQUID_POSTER_1_LINK}
              name={LIQUID_POSTER_1}
              posterNumber={1}
              youtube={LIQUID_POSTER_1_YOUTUBE}
              youtubeLink={LIQUID_POSTER_1_YOUTUBE_LINK}
            />
            <PressLiquidPoster
              link={LIQUID_POSTER_2_LINK}
              name={LIQUID_POSTER_2}
              posterNumber={2}
              youtube=""
              youtubeLink=""
            />
          </div>
          <div className="press__liquid-posters-row">
            <PressLiquidPoster
              link={LIQUID_POSTER_3_LINK}
              name={LIQUID_POSTER_3}
              posterNumber={3}
              youtube=""
              youtubeLink=""
            />
            <PressLiquidPoster
              link={LIQUID_POSTER_4_LINK}
              name={LIQUID_POSTER_4}
              posterNumber={4}
              youtube=""
              youtubeLink=""
            />
          </div>
          <div className="press__liquid-posters-row">
            <PressLiquidPoster
              link={LIQUID_POSTER_5_LINK}
              name={LIQUID_POSTER_5}
              posterNumber={5}
              youtube=""
              youtubeLink=""
            />
          </div>
        </div>
      </div>
      <div className="press__gallery-section">
        <h2 className="press__heading press__heading--larger">Gallery</h2>
        <div className="press__gallery">
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 1"
                height="56.3%"
                layout="responsive"
                src="/img/press/01_Tobias_Rehberger_Liquid_Poster_Detail_1.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 1
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_1_LINK, 'Liquid Poster Detail 1', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 2"
                height="56.3%"
                layout="responsive"
                src="/img/press/02_Tobias_Rehberger_Liquid_Poster_Detail_2.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 2
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_2_LINK, 'Liquid Poster Detail 2', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 3"
                height="56.3%"
                layout="responsive"
                src="/img/press/03_Tobias_Rehberger_Liquid_Poster_Detail_3.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 3
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_3_LINK, 'Liquid Poster Detail 3', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 4"
                height="56.3%"
                layout="responsive"
                src="/img/press/04_Tobias_Rehberger_Liquid_Poster_Detail_4.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 4
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_4_LINK, 'Liquid Poster Detail 4', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 5"
                height="56.3%"
                layout="responsive"
                src="/img/press/05_Tobias_Rehberger_Liquid_Poster_Detail_5.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 5
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_5_LINK, 'Liquid Poster Detail 5', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 6"
                height="56.3%"
                layout="responsive"
                src="/img/press/06_Tobias_Rehberger_Liquid_Poster_Detail_6.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 6
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_6_LINK, 'Liquid Poster Detail 6', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Liquid Poster Detail 7"
                height="56.3%"
                layout="responsive"
                src="/img/press/07_Tobias_Rehberger_Liquid_Poster_Detail_7.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Liquid Poster Detail 7
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(IMAGE_7_LINK, 'Liquid Poster Detail 7', 'jpg')
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Tobias Rehberger Portrait in Landscape Format"
                height="56.3%"
                layout="responsive"
                src="/img/press/08_Tobias_Rehberger_Portrait_In_Landscape_Format.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Portrait Tobias Rehberger
              <br />
              Photo: Swatch
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(
                  IMAGE_8_LINK,
                  'Tobias Rehberger Portrait in Landscape Format',
                  'jpg'
                )
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Tobias Rehberger Portrait in Portrait Format"
                height="100%"
                layout="responsive"
                src="/img/press/09_Tobias_Rehberger_Portrait_In_Portrait_Format.jpg"
                width="72.6%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Portrait Tobias Rehberger
              <br />
              Photo: Swatch
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(
                  IMAGE_9_LINK,
                  'Tobias Rehberger Portrait in Portrait Format',
                  'jpg'
                )
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Kunstmuseum Stuttgart Facade Installation"
                height="63.7%"
                layout="responsive"
                src="/img/press/10_Tobias_Rehberger_Kunstmuseum_Stuttgart_Facade_Installation.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Tobias Rehberger
              <br />
              »Free Coffee Free Parking Freedom«, 2018
              <br />
              Courtesy of the artist and neugerriemschneider, Berlin
              <br />
              »Paysage vu à travers un point d’observation« (Selection), 2016
              <br />
              Courtesy of the artist and Societé Grand Paris
              <br />
              Photo: Wolfgang Günzel, Offenbach
              <br />© Tobias Rehberger
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(
                  IMAGE_10_LINK,
                  'Kunstmuseum Stuttgart Facade Installation',
                  'jpg'
                )
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Installation 'I Do If I don`t'"
                height="72.7%"
                layout="responsive"
                src="/img/press/11_Tobias_Rehberger_Installation_I_Do_If_I_Don_t.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              Tobias Rehberger
              <br />
              Installation view »I do if I don’t«,
              <br />
              Kunstmuseum Stuttgart, 2022
              <br />
              Photo: Wolfgang Günzel, Offenbach
              <br />© Tobias Rehberger
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(
                  IMAGE_11_LINK,
                  'Installation "I Do If I don\'t"',
                  'jpg'
                )
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
          <div className="press__gallery-image-container">
            <div className="press__gallery-image">
              <Image
                alt="Was Du liebst, bringt dich auch zum Weinen"
                height="82.3%"
                layout="responsive"
                src="/img/press/12_Tobias_Rehberger_Was_Du_Liebst_Bringt_Dich_Auch_Zum_Weinen.jpg"
                width="100%"
              />
            </div>
            <div className="press__gallery-image-caption">
              »Was Du liebst, bringt dich auch zum Weinen«, 2009
              <br />
              Palazzo delle Esposizioni, Biennale di Venezia, IT
              <br />
              Photo: Wolfgang Günzel
              <br />
              Courtesy: neugerriemschneider, Berlin
              <br />© Tobias Rehberger
            </div>
            <button
              className="btn btn--quarternary press__gallery-btn"
              onClick={() =>
                download(
                  IMAGE_12_LINK,
                  'Was Du liebst, bringt dich auch zum Weinen',
                  'jpg'
                )
              }
              type="button"
            >
              <Image
                alt="Download"
                height="15"
                src="/img/icons/download.svg"
                width="15"
              />
              Download
            </button>
          </div>
        </div>
      </div>
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
