import sendError from '@/lib/errorHandling';
import { uniCryptConvert } from '@/lib/unicrypt';
import { ErrorTypes } from '@/static-data/errors';

const handler = async (req, res) => {
  try {
    const amount = await uniCryptConvert(req.body);
    res.status(200).json({ success: true, data: { amount } });
  } catch (e) {
    sendError(res, ErrorTypes.GENERIC_ERROR);
  }
};

export default handler;
