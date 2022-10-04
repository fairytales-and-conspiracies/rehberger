import { Web3ReactProvider } from '@web3-react/core';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import Web3 from 'web3';

import { ConnectWalletProvider } from '@/context/ConnectWalletContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { ShoppingCartProvider } from '@/context/ShoppingCartContext';
import { UniCryptProvider } from '@/context/UniCryptContext';
import { Web3Provider } from '@/context/Web3Context';
import '@/styles/globals.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function getLibrary(provider) {
  return new Web3(provider);
}

function MyApp({ Component, pageProps }) {
  const { pathname, asPath } = useRouter();

  useEffect(() => {
    const sectionId = asPath.split(`${pathname}#`)[1];

    // some browsers (like safari) may require a timeout to delay calling this function after a page has loaded; otherwise, it may not update the position
    setTimeout(() => {
      window.scrollTo({
        top: sectionId ? document.getElementById(sectionId).offsetTop : 0,
        left: 0,
        behavior: 'instant',
      });
    }, 0);
  }, [asPath, pathname]);

  return (
    <>
      <Head>
        <title>Fairytales & Conspiracies</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3Provider>
            <ConnectWalletProvider>
              <ShoppingCartProvider>
                <UniCryptProvider>
                  <PaymentProvider>
                    <Component />
                  </PaymentProvider>
                </UniCryptProvider>
              </ShoppingCartProvider>
            </ConnectWalletProvider>
          </Web3Provider>
        </Web3ReactProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
