import axios from 'axios';

import { address as contractAddress, abi } from '@contract/exampleContract';

const ADDRESS_FROM = process.env.NEXT_PUBLIC_ADDRESS_FROM;

export default async function sendTransaction(
  address,
  selectedFrames,
  values,
  web3
) {
  try {
    const contract = new web3.eth.Contract(abi, contractAddress);

    let tokenIds = selectedFrames.map((frame) => frame.frame);
    // TODO: Remove this next line which is only for testing purposes
    // 77 -93 245 333 548 570 -719
    tokenIds = [93, 719];
    const amounts = Array(tokenIds.length).fill(1);

    const tx = await contract.methods
      .buyNFTs(ADDRESS_FROM, address, tokenIds, amounts, '0x00')
      .send({
        from: address,
        value: web3.utils.toWei((tokenIds.length * 0.001).toString(), 'ether'),
      });

    console.log('Transaction: ', tx);

    const postToApi = await axios.post('/api/customers', values);

    console.log('API Post: ', postToApi);

    return tx;
  } catch (err) {
    console.log('Error :', err);
    return null;
  }
}
