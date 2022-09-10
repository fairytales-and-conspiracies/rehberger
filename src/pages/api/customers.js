import dbConnect from '@/lib/dbConnect';
import sendMail from '@/lib/sendMail';
import Customer from '@/models/Customer';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const customers = await Customer.find({});
        res.status(200).json({ success: true, data: customers });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const customer = await Customer.create(req.body);
        sendMail(true, customer).catch(console.error);
        res.status(201).json({ success: true, data: customer });
      } catch (error) {
        sendMail(false, error).catch(console.error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
