import axios from 'axios';
import crypto from 'crypto';

const logError = (e) => {
  if (e.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log('Server responded');
    console.log('Data:', e.response.data);
    console.log('Status', e.response.status);
    console.log('Headers', e.response.headers);
  } else if (e.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log('Server did not respond');
    console.log('Request:', e.request);
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log('Config error');
    console.log('Message:', e.message);
  }

  console.log('Config:', e.config);
};

const uniCryptApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UNICRYPT_API,
});

async function getUniCryptSeed() {
  const path = `/auth/seed?email=${process.env.UNICRYPT_EMAIL}`;
  const ret = await uniCryptApi.get(path);
  console.log('UNICRYPT SEED RET', ret.data.seed_key);
  return ret.data;
}

function getRandomizedPassword(password, seedData) {
  const hashedPassword = crypto
    .createHash('sha256')
    .update(password + seedData.seed_key)
    .digest('hex');
  return crypto
    .createHash('sha256')
    .update(hashedPassword + seedData.random_key)
    .digest('hex'); //.split('0x')[1];
}

export async function uniCryptAuth() {
  try {
    const seedData = await getUniCryptSeed();
    const path = `/auth/login`;
    const password = getRandomizedPassword(
      process.env.UNICRYPT_PASSWORD,
      seedData
    );
    const ret = await uniCryptApi.post(path, {
      email: process.env.UNICRYPT_EMAIL,
      password,
      randomkey: seedData.random_key,
    });
    console.log('UNICRYPT AUTH RET', ret.data.bearer_token);
    return ret.data.bearer_token;
  } catch (e) {
    logError(e);
    throw e;
  }
}

export async function uniCryptConvert(req) {
  try {
    const {
      source_currency,
      destination_currency,
    } = req;

    const path = `/markets`;
    const ret = await uniCryptApi.get(path);
    const ethUsdPair = ret.data.find((pair) => pair.name === `${source_currency}/USD`);
    const eurUsdPair = ret.data.find((pair) => pair.name === `${destination_currency}/USD`);
    console.log('UNICRYPT MARKETS', { ethUsd: ethUsdPair.price, eurUsd: eurUsdPair.price });
    return ethUsdPair.price / eurUsdPair.price;
  } catch (e) {
    logError(e);
    throw e;
  }
}
