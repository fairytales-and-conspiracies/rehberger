import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import EmailSignup from '@/models/EmailSignup';
import { ErrorTypes } from '@/static-data/errors';

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { email } = req.body;
        const timestamp = Date.now();
        await EmailSignup.create({ email, timestamp });
        res.status(200).json({ success: true, data: { email, timestamp } });
      } catch (err) {
        sendError(res, ErrorTypes.GENERIC_ERROR);
      }
      return;

    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
