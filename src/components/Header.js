import { useWeb3 } from '@3rdweb/hooks';
import Image from 'next/image';
import Link from 'next/link';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM == 'true';

export default function Header() {
  const { address, connectWallet } = useWeb3();

  return (
    <header className="header">
      <div className="header__logo">
        <Image
          alt="Fairytales and conspiracies"
          layout="fill"
          src={'/img/fairytales-conspiracies.svg'}
        />
      </div>
      <nav className={`header__nav ${INTERIM ? 'header__nav--hidden' : ''}`}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="#">NFTs</Link>
          </li>
          <li>
            <Link href="/work">Work</Link>
          </li>
          <li>
            <Link href="/artist">Artist</Link>
          </li>
          <li>
            <Link href="/music">Music</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
        </ul>
      </nav>
      <div className="header__shop max-screen-sm-hidden">
        <button
          className="btn btn--primary"
          disabled={INTERIM}
          {...(!address && { onClick: () => connectWallet('injected') })}
        >
          {!!address
            ? `${address.slice(0, 5)}...${address.slice(
                address.length - 5,
                address.length - 1
              )}`
            : '+ Connect wallet'}
        </button>
        {INTERIM && (
          <button className="btn btn--primary btn--small" disabled>
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
      <button className="header__menu-button btn min-screen-sm-hidden">
        <Image alt="Menu" height="16" src="/img/icons/menu.svg" width="30" />
      </button>
    </header>
  );
}
