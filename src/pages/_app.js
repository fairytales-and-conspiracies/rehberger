import { Web3ReactProvider } from '@web3-react/core';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import Web3 from 'web3';

import { ConnectWalletProvider } from '@/context/ConnectWalletContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { ShoppingCartProvider } from '@/context/ShoppingCartContext';
import { Web3Provider } from '@/context/Web3Context';
import '@/styles/globals.scss';

function getLibrary(provider) {
  return new Web3(provider);
}

function MyApp({ Component, pageProps }) {
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
                <PaymentProvider>
                  <Component />
                </PaymentProvider>
              </ShoppingCartProvider>
            </ConnectWalletProvider>
          </Web3Provider>
        </Web3ReactProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
