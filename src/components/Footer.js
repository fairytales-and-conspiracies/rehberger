import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <Link href="/imprint">Imprint</Link>
      <span>@2022</span>
      <span className="footer__socials">
        <span className="footer__social-link">
          <Link href="#">
            <a>
              <Image
                alt="Rehberger Linked In"
                height="18"
                src="/img/icons/linkedin.svg"
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
                src="/img/icons/facebook.svg"
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
                src="/img/icons/twitter.svg"
                width="18"
              />
            </a>
          </Link>
        </span>
      </span>
    </footer>
  );
}
