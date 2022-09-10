import stripe from '@/lib/stripe';
import { getEthToEurRate } from '@/utils/conversion';

const { CURRENCY } = process.env;
const { SERVER_URL } = process.env;

const nftPriceInCents = getEthToEurRate(process.env.NFT_PRICE_ETH) * 100;

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { confirmationKey, items } = req.body;
        const session = await stripe.checkout.sessions.create({
          cancel_url: `${SERVER_URL}/cancel`,
          client_reference_id: confirmationKey,
          line_items: items.map((item) => ({
            price_data: {
              currency: CURRENCY,
              product_data: {
                name: `${item.time}`,
              },
              unit_amount: nftPriceInCents,
            },
            quantity: 1,
          })),
          mode: 'payment',
          payment_method_types: ['card'],
          success_url: `${SERVER_URL}/shopping-cart?thank-you`,
        });
        res.status(200).json({ success: true, url: session.url });
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
