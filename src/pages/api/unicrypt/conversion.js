import sendError from '@/lib/errorHandling';
import { uniCryptConvert } from '@/lib/unicrypt';
import { ErrorTypes } from '@/static-data/errors';

const handler = async (req, res) => {
  try {
    const { data, config } = req.body;
    console.log("HANDLER unic convert", data, config)
    const amount = await uniCryptConvert(data, config);
    res.status(200).json({ success: true, data: { amount } });
  } catch (e) {
    sendError(res, ErrorTypes.GENERIC_ERROR);
  }
};

export default handler;
