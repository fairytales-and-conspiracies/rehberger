import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import Frame from '@/models/Frame';
import { ErrorTypes } from '@/static-data/errors';
import cleanupReservations from './reservations/cleanup';

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        await cleanupReservations();

        const { query } = req;
        const frames = await Frame.find(query);
        const data = frames.map((frame) => ({
          // eslint-disable-next-line no-underscore-dangle
          _id: frame._id,
          video: frame.video,
          frame: frame.frame,
          time: frame.time,
          sold: frame.sold,
          reserved: !!frame.reservedBy,
          reservedBy: null,
        }));
        res.status(200).json({ success: true, data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      sendError(res, ErrorTypes.METHOD_NOT_ALLOWED);
      break;
  }
};

export default handler;
