/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function Footer() {
  return (
    <footer className={`footer ${INTERIM ? 'footer--interim' : ''}`}>
      <span>@2022</span>
      <Link href="/press">Press</Link>
      <Link href="/imprint">Imprint</Link>
      <span className="footer__socials">
        <span className="footer__social-link">
          <Link href="#">
            <a>
              <Image
                alt="Rehberger Linked In"
                height="18"
                src="/img/icons/linkedin-red.svg"
                width="18"
              />
            </a>
          </Link>
        </span>
        <span className="footer__social-link">
          <Link href="#">
            <a>
              <Image
                alt="Rehberger Facebook"
                height="18"
                src="/img/icons/facebook-red.svg"
                width="18"
              />
            </a>
          </Link>
        </span>
        <span className="footer__social-link">
          <Link href="#">
            <a>
              <Image
                alt="Rehberger Twitter"
                height="18"
                src="/img/icons/twitter-red.svg"
                width="18"
              />
            </a>
          </Link>
        </span>
      </span>
    </footer>
  );
}
