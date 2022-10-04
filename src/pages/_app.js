import { Web3ReactProvider } from '@web3-react/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import Web3 from 'web3';

import { ConnectWalletProvider } from '@/context/ConnectWalletContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { ShoppingCartProvider } from '@/context/ShoppingCartContext';
import { UniCryptProvider } from '@/context/UniCryptContext';
import { Web3Provider } from '@/context/Web3Context';
import * as gtag from '@/lib/gtag';
import environments from '@/static-data/environments';
import '@/styles/globals.scss';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

function getLibrary(provider) {
  return new Web3(provider);
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { asPath, pathname } = router;

  useEffect(() => {
    if (ENVIRONMENT !== environments.LOCAL) {
      const handleRouteChange = (url) => {
        gtag.pageview(url);
      };

      router.events.on('routeChangeComplete', handleRouteChange);
      router.events.on('hashChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
        router.events.off('hashChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  useEffect(() => {
    // When page is changed, the auto scroll to top happens slowly and we need instant scroll to happen
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
      {ENVIRONMENT !== environments.LOCAL && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `,
            }}
          />
        </>
      )}

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
