import Image from 'next/image';

const SocialMedia = ({ large }) => {
  return (
    <div className={`social-media ${large ? 'social-media--large' : ''}`}>
      <div className="social-media__text">Or follow us on social media.</div>
      <div className="social-media__medias">
        <span
          className={`social-media__social-link ${
            large ? 'social-media__social-link--large' : ''
          }`}
        >
          <a
            href="https://twitter.com/fairytalesandc"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="Rehberger Twitter"
              height="100%"
              layout="responsive"
              src="/img/icons/twitter-large.svg"
              width="100%"
            />
          </a>
        </span>
        <span
          className={`social-media__social-link ${
            large ? 'social-media__social-link--large' : ''
          }`}
        >
          <a
            href="https://www.instagram.com/fairytalesandconspiracies/"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="Rehberger Instagram"
              height="100%"
              layout="responsive"
              src="/img/icons/instagram-large.svg"
              width="100%"
            />
          </a>
        </span>
        <span
          className={`social-media__social-link ${
            large ? 'social-media__social-link--large' : ''
          }`}
        >
          <a href="https://t.co/QI165OgqjF" rel="noreferrer" target="_blank">
            <Image
              alt="Rehberger Discord"
              height="100%"
              layout="responsive"
              src="/img/icons/discord-large.svg"
              width="100%"
            />
          </a>
        </span>
        <span
          className={`social-media__social-link ${
            large ? 'social-media__social-link--large' : ''
          }`}
        >
          <a
            href="https://t.me/fairytalesandconspiracies"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="Rehberger Telegram"
              height="100%"
              layout="responsive"
              src="/img/icons/telegram-large.svg"
              width="100%"
            />
          </a>
        </span>
        <span
          className={`social-media__social-link ${
            large ? 'social-media__social-link--large' : ''
          }`}
        >
          <a
            href="https://www.facebook.com/profile.php?id=100085234524658"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="Rehberger Facebook"
              height="100%"
              layout="responsive"
              src="/img/icons/facebook-large.svg"
              width="100%"
            />
          </a>
        </span>
      </div>
    </div>
  );
};

export default SocialMedia;
