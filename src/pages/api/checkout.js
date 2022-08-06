import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = process.env.CURRENCY;
const nftPriceInCents = process.env.NFT_PRICE * 100;
const serverUrl = process.env.SERVER_URL;

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { items, orderNumber } = req.body;
        const session = await stripe.checkout.sessions.create({
          cancel_url: `${serverUrl}/cancel`,
          line_items: items.map((item) => ({
            price_data: {
              currency: currency,
              product_data: {
                name: `${item.time}`,
              },
              unit_amount: nftPriceInCents,
            },
            quantity: 1,
          })),
          mode: 'payment',
          payment_method_types: ['card'],
          success_url: `${serverUrl}/shopping-cart?order-number=${orderNumber}`,
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
