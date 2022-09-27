import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';

const UniCryptContext = createContext();

export function UniCryptProvider({ children }) {
  const [ethToEurRate, setEthToEurRate] = useState(undefined);
  const [rateFetchingRequested, requestRateFetching] = useState(false);

  const fetchEthToEurRate = useCallback(async () => {
    const { data } = await axios.post('/api/unicrypt-rates', {
      source_currency: 'ETH',
      destination_currency: 'EUR',
      source_amount: 1,
    });

    const { success, amount } = data;
    if (success && amount) {
      setEthToEurRate(amount);
    }

    return amount;
  }, []);

  useEffect(() => {
    if (rateFetchingRequested) {
      fetchEthToEurRate();
      setTimeout(() => {
        requestRateFetching(false);
      }, 10000);
    }
  }, [fetchEthToEurRate, rateFetchingRequested]);

  const getEthToEurRate = useCallback(() => {
    if (ethToEurRate === undefined) {
      requestRateFetching(true);
    }

    return ethToEurRate;
  }, [ethToEurRate]);

  return (
    <UniCryptContext.Provider
      value={{
        fetchEthToEurRate,
        getEthToEurRate,
      }}
    >
      {children}
    </UniCryptContext.Provider>
  );
}

export default UniCryptContext;
