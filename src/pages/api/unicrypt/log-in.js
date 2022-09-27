import sendError from '@/lib/errorHandling';
import { uniCryptAuth } from '@/lib/unicrypt';
import { ErrorTypes } from '@/static-data/errors';

const handler = async (req, res) => {
  try {
    const token = await uniCryptAuth();
    res.status(200).json({ success: true, data: { token } });
  } catch (e) {
    sendError(res, ErrorTypes.GENERIC_ERROR);
  }
};

export default handler;
