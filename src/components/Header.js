/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import ConnectWalletButton from '@/components/ConnectWalletButton';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function Header({ logoOnly, modalOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onMenuClick = () => {
    const newIsMenuOpen = !isMenuOpen;
    setIsMenuOpen(newIsMenuOpen);

    if (newIsMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  const onLinkClick = () => {
    setIsMenuOpen(false);
  };

  let menuButtonImage;
  if (INTERIM) {
    menuButtonImage = '/img/icons/menu-disabled.svg';
  } else if (!isMenuOpen) {
    menuButtonImage = '/img/icons/menu.svg';
  } else {
    menuButtonImage = '/img/icons/close.svg';
  }

  return (
    <header className={`header ${modalOpen ? 'header--modal-open' : ''}`}>
      <Link href="/" passHref>
        <a
          className="header__logo"
          onClick={onLinkClick}
          role="link"
          tabIndex="0"
        >
          <Image
            alt="Fairytales and conspiracies"
            layout="fill"
            src="/img/fairytales-conspiracies.svg"
          />
        </a>
      </Link>
      <nav
        className={`header__nav ${
          INTERIM || logoOnly ? 'header__nav--hidden' : ''
        } ${isMenuOpen ? 'header__nav--open' : ''}`}
      >
        <div className="header__mobile-button-area">
          {!INTERIM && <ConnectWalletButton />}
          {INTERIM && (
            <button
              className="btn btn--primary btn--small header__mobile-button"
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
              <a className="btn btn--primary btn--small header__mobile-button">
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
        <ul>
          <li>
            <Link href="/#nfts">
              <a onClick={onLinkClick} role="link" tabIndex="0">
                NFTs
              </a>
            </Link>
          </li>
          <li>
            <Link href="/#work">
              <a onClick={onLinkClick} role="link" tabIndex="0">
                Work
              </a>
            </Link>
          </li>
          <li>
            <Link href="/#artist">
              <a onClick={onLinkClick} role="link" tabIndex="0">
                Artist
              </a>
            </Link>
          </li>
          <li>
            <Link href="/#music">
              <a onClick={onLinkClick} role="link" tabIndex="0">
                Music
              </a>
            </Link>
          </li>
          <li>
            <Link href="/#faq">
              <a onClick={onLinkClick} role="link" tabIndex="0">
                FAQ
              </a>
            </Link>
          </li>
          <li>
            <Link href="/#join">
              <a onClick={onLinkClick} role="link" tabIndex="0">
                Join
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      {!logoOnly && (
        <>
          <div className="header__shop max-screen-sm-hidden">
            {!INTERIM && <ConnectWalletButton />}
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
            className={`header__menu-button btn min-screen-sm-hidden ${
              isMenuOpen ? 'header__menu-button--menu-open' : ''
            } ${INTERIM ? 'header__menu-button--interim' : ''}`}
            onClick={!INTERIM ? onMenuClick : () => {}}
            type="button"
          >
            <Image
              alt="Menu"
              height={isMenuOpen ? '33' : '16'}
              src={menuButtonImage}
              width={isMenuOpen ? '33' : '30'}
            />
          </button>
        </>
      )}
    </header>
  );
}
