import axios from 'axios';
import { createContext, useCallback, useState } from 'react';

const UniCryptContext = createContext();

export function UniCryptProvider({ children }) {
  const [ethToEurRate, setEthToEurRate] = useState(undefined);

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

  const getEthToEurRate = useCallback(() => {
    return ethToEurRate !== undefined ? ethToEurRate : fetchEthToEurRate();
  }, [ethToEurRate, fetchEthToEurRate]);

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
