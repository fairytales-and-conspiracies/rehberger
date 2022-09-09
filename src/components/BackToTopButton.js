/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';

export default function BackToTopButton() {
  return (
    <button className="back-to-top" type="button">
      <Link href="">
        <a className="back-to-top__link">
          <Image
            alt="Back to top"
            height="30"
            src="/img/icons/chevron-up.svg"
            width="40"
          />
        </a>
      </Link>
    </button>
  );
}
