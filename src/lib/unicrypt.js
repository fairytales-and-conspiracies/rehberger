import { logError } from '@/utils/log';
import axios from 'axios';

// This has been changed to Coinbase API, but we kept
// the UniCrypt name to avoid unnecessary refactoring

const uniCryptApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UNICRYPT_API,
});

async function uniCryptConvert(req) {
  try {
    const {
      source_currency: sourceCurrency,
      destination_currency: destinationCurrency,
    } = req;

    const path = `/exchange-rates?currency=${sourceCurrency}`;
    const { data } = await uniCryptApi.get(path);
    const rate = +data.data.rates[destinationCurrency];
    return rate;

    // const firstPairName = `${sourceCurrency}/USD`;
    // const secondPairName = `${destinationCurrency}/USD`;
    // const resultPairName = `${sourceCurrency}/${destinationCurrency}`;

    // const firstPairPrice = ret.data.find(
    //   (pair) => pair.name === firstPairName
    // )?.price;
    // const secondPairPrice = ret.data.find(
    //   (pair) => pair.name === secondPairName
    // )?.price;
    // const resultPairPrice =
    //   firstPairPrice && secondPairPrice
    //     ? firstPairPrice / secondPairPrice
    //     : undefined;

    // console.log('PRICES', {
    //   [firstPairName]: firstPairPrice,
    //   [secondPairName]: secondPairPrice,
    //   [resultPairName]: resultPairPrice,
    // });

    // return resultPairPrice;
  } catch (e) {
    logError(e);
    throw e;
  }
}

export default uniCryptConvert;
