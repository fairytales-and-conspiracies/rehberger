/* eslint-disable */
import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';

const UNICRYPT_SESSION_STORAGE_KEY = 'unicrypt';

const UniCryptContext = createContext();

export function UniCryptProvider({ children }) {
  const [token, setToken] = useState(undefined);
  const [ethToEurRate, setEthToEurRate] = useState(undefined);

  const updateEthToEurRate = useCallback(
    (token) => {
      const { success, data } = axios.post('/api/unicrypt/conversion', {
        data: {
          source_currency: "ETH",
          destination_currency:"EUR",
          source_amount: 1,
        },
        config: {
          headers:{ 'Authorization': `Bearer ${token}` }
        },
      });

      if (success) {
        console.log("SUCC conversion", data)

        if (data.amount) {
          console.log("RATE UPDATED", data.amount)
          setEthToEurRate(data.amount);
        } else {
          console.log("ERROR amount undefined")    
        }
      } else {
        console.log("ERROR conversion request failed")  
      }

      return data?.amount;
    },
    []
  )

  useEffect(() => {
    let tokenInStorage =
      sessionStorage.getItem(UNICRYPT_SESSION_STORAGE_KEY) ||
      undefined;

    console.log("TOKEN IN STORAGE", tokenInStorage, typeof tokenInStorage)

    if (tokenInStorage === undefined) {
      console.log("INIT AXIOS UNICRYTP REQ")

      axios.post('/api/unicrypt/log-in')
        .then((result) => {
          const { data: { data: { token } } } = result;
          console.log("SUCC DATA", token)
          if (token) {
            console.log("DONE", token)
            tokenInStorage = token;
            sessionStorage.setItem(UNICRYPT_SESSION_STORAGE_KEY, tokenInStorage);
            setToken(tokenInStorage);
            updateEthToEurRate(tokenInStorage)
          } else {
            console.log("ERROR token undefined")  
          }
        })
        .catch((e) => {
          console.log("ERROR", e)
        });
    } else {
      console.log("JUST SET IT")

      setToken(tokenInStorage);
    }
  }, [updateEthToEurRate]);

  const getEthToEurRate = useCallback(
    (forceFetch = false) => {
      if (token === undefined) {
        console.log("TOKEN UNDEFINED")
        return ethToEurRate;
      }

      if (ethToEurRate === undefined || forceFetch) {
        console.log("INIT CONVERSION UNICRYTP REQ", token, forceFetch)

        const amount = updateEthToEurRate(token);

        if (forceFetch) {
          return amount;
        }
      }

      return ethToEurRate;
    },
    [ethToEurRate, token]
  )

  return (
    <UniCryptContext.Provider value={{ getEthToEurRate }}>
      {children}
    </UniCryptContext.Provider>
  );
}

export default UniCryptContext;
