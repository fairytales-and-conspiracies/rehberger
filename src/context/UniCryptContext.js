import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';

const UniCryptContext = createContext();

export function UniCryptProvider({ children }) {
  const [ethToEurRate, setEthToEurRate] = useState(undefined);
  const [fetchRatePeriodically, requestfetchRatePeriodically] = useState(false);

  const fetchEthToEurRate = useCallback(async () => {
    const { data } = await axios.post('/api/unicrypt-rates', {
      source_currency: 'ETH',
      destination_currency: 'EUR',
    });

    const { success, amount } = data;
    if (success && amount) {
      setEthToEurRate(amount);
    }

    return amount;
  }, []);

  useEffect(() => {
    let handle;
    if (fetchRatePeriodically) {
      fetchEthToEurRate();
      
      handle = setInterval(() => {
        fetchEthToEurRate();
      }, 10000);
    }

    return () => clearInterval(handle);
  }, [fetchEthToEurRate, fetchRatePeriodically]);

  return (
    <UniCryptContext.Provider
      value={{
        ethToEurRate,
        requestfetchRatePeriodically,
      }}
    >
      {children}
    </UniCryptContext.Provider>
  );
}

export default UniCryptContext;
