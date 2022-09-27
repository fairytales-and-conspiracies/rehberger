import axios from 'axios';
import { createContext, useCallback, useState } from 'react';

const UniCryptContext = createContext();

export function UniCryptProvider({ children }) {
  const [ethToEurRate, setEthToEurRate] = useState(undefined);

  const updateEthToEurRate = useCallback(() => {
    const { success, data } = axios.post('/api/unicrypt/conversion', {
      source_currency: 'ETH',
      destination_currency: 'EUR',
      source_amount: 1,
    });

    if (success && data.amount) {
      setEthToEurRate(data.amount);
    }

    return data?.amount;
  }, []);

  const getEthToEurRate = useCallback(
    (forceFetch = false) => {
      if (ethToEurRate === undefined || forceFetch) {
        const amount = updateEthToEurRate();

        if (forceFetch) {
          return amount;
        }
      }

      return ethToEurRate;
    },
    [ethToEurRate]
  );

  return (
    <UniCryptContext.Provider value={{ getEthToEurRate }}>
      {children}
    </UniCryptContext.Provider>
  );
}

export default UniCryptContext;
