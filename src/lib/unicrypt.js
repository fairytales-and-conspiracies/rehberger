import { logError } from '@/utils/log';
import axios from 'axios';

const uniCryptApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UNICRYPT_API,
});

export async function uniCryptConvert(req) {
  try {
    const {
      source_currency,
      destination_currency,
    } = req;

    const path = `/markets`;
    const ret = await uniCryptApi.get(path);

    const firstPairName = `${source_currency}/USD`;
    const secondPairName = `${destination_currency}/USD`;
    const resultPairName = `${source_currency}/${destination_currency}`;

    const firstPairPrice = ret.data.find((pair) => pair.name === firstPairName)?.price;
    const secondPairPrice = ret.data.find((pair) => pair.name === secondPairName)?.price;
    const resultPairPrice = firstPairPrice && secondPairPrice ? firstPairPrice / secondPairPrice : undefined;

    console.log('PRICES', { [firstPairName]: firstPairPrice, [secondPairName]: secondPairPrice, [resultPairName]: resultPairPrice });

    return resultPairPrice;
  } catch (e) {
    logError(e);
    throw e;
  }
}
