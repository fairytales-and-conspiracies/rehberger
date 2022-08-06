import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import Head from 'next/head';

import { ShoppingCartProvider } from '@context/ShoppingCartContext';
import '@styles/globals.scss';

const desiredChainId = ChainId.Rinkeby;
const supportedChainIds = [ChainId.Mainnet, ChainId.Rinkeby];

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Fairytales & Conspiracies</title>
      </Head>
      <ThirdwebProvider
        desiredChainId={desiredChainId}
        supportedChainIds={supportedChainIds}
      >
        <ShoppingCartProvider>
          <Component {...pageProps} />
        </ShoppingCartProvider>
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;
