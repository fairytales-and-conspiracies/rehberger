import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

import { ShoppingCartProvider } from '@context/ShoppingCartContext';
import '@styles/globals.scss';

const supportedChainIds = [1, 4];
const connectors = {
  injected: {},
};

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <ShoppingCartProvider>
        <Component {...pageProps} />
      </ShoppingCartProvider>
    </ThirdwebWeb3Provider>
  );
}

export default MyApp;
