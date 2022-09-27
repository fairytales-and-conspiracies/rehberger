import stripe from '@/lib/stripe';
import { ethToEur } from '@/utils/conversion';
import { getFrameName } from '@/utils/frames';

const { CURRENCY } = process.env;
const { SERVER_URL } = process.env;

export const checkout = async (confirmationKey, items, priceInCents) => {
  const session = await stripe.checkout.sessions.create({
    cancel_url: `${SERVER_URL}/cancel`,
    client_reference_id: confirmationKey,
    line_items: items.map((item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: `${getFrameName(item)}`,
        },
        unit_amount: priceInCents,
      },
      quantity: 1,
    })),
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${SERVER_URL}/shopping-cart?thank-you`,
  });
  return session.url;
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { confirmationKey, items, ethToEurRate } = req.body;
        const nftPriceInCents = ethToEur(process.env.NEXT_PUBLIC_NFT_PRICE_ETH, ethToEurRate) * 100;
        const url = checkout(confirmationKey, items, nftPriceInCents);
        res.status(200).json({ success: true, url });
      } catch (err) {
        console.error('Error sending data to Stripe: ', err);
        res.status(400).json({ success: false, error: err });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
