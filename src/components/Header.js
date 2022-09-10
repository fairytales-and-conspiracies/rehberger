import Image from 'next/image';
import Link from 'next/link';

import ConnectWalletButton from '@/components/ConnectWalletButton';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function Header({ logoOnly }) {
  return (
    <header className="header">
      <div className="header__logo">
        <Image
          alt="Fairytales and conspiracies"
          layout="fill"
          src="/img/fairytales-conspiracies.svg"
        />
      </div>
      <nav
        className={`header__nav ${
          INTERIM || logoOnly ? 'header__nav--hidden' : ''
        }`}
      >
        <ul>
          <li>
            <Link href="/#home">Home</Link>
          </li>
          <li>
            <Link href="/#nfts">NFTs</Link>
          </li>
          <li>
            <Link href="/#work">Work</Link>
          </li>
          <li>
            <Link href="/#artist">Artist</Link>
          </li>
          <li>
            <Link href="/#music">Music</Link>
          </li>
          <li>
            <Link href="/#faq">FAQ</Link>
          </li>
        </ul>
      </nav>
      {!logoOnly && (
        <>
          <div className="header__shop max-screen-sm-hidden">
            <ConnectWalletButton />
            {INTERIM && (
              <button
                className="btn btn--primary btn--small"
                disabled
                type="button"
              >
                <Image
                  alt="Shopping cart"
                  height="20"
                  src="/img/icons/shopping-cart-disabled.svg"
                  width="20"
                />
              </button>
            )}
            {!INTERIM && (
              <Link href="/shopping-cart">
                <a className="btn btn--primary btn--small">
                  <Image
                    alt="Shopping cart"
                    height="20"
                    src="/img/icons/shopping-cart.svg"
                    width="20"
                  />
                </a>
              </Link>
            )}
          </div>
          <button
            className="header__menu-button btn min-screen-sm-hidden"
            type="button"
          >
            <Image
              alt="Menu"
              height="16"
              src="/img/icons/menu.svg"
              width="30"
            />
          </button>
        </>
      )}
    </header>
  );
}
