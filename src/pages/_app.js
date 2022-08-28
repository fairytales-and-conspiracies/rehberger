import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import Head from 'next/head';

import { ShoppingCartProvider } from '@context/ShoppingCartContext';
import { Web3Provider } from '@context/Web3Context';
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
        <Web3Provider>
          <ShoppingCartProvider>
            <Component {...pageProps} />
          </ShoppingCartProvider>
        </Web3Provider>
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;
