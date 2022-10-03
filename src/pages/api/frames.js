import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import Frame from '@/models/Frame';
import { ErrorTypes } from '@/static-data/errors';

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { query } = req;
        const frames = await Frame.find(query);
        res.status(200).json({ success: true, data: frames });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        // TODO: Add check to make sure no random people can call
        // this and set frames to sold
        const { body } = req;
        const videoNames = Object.keys(body);
        if (videoNames.length === 0) {
          res.status(200).json({ success: true, data: [] });
          return;
        }
        const query = {
          $or: [],
        };
        videoNames.forEach((videoName) => {
          const frames = body[videoName];
          if (frames.length === 0) {
            return;
          }

          query.$or.push({
            video: videoName,
            frame: {
              $in: [],
            },
            sold: true,
          });

          const index = query.$or.length - 1;
          frames.forEach((frame) => {
            query.$or[index].frame.$in.push(frame);
          });
        });

        const frames = await Frame.find(query);
        res.status(200).json({ success: true, data: frames });
      } catch (error) {
        sendError(res, ErrorTypes.GENERIC_ERROR);
      }
      break;
    default:
      sendError(res, ErrorTypes.METHOD_NOT_ALLOWED);
      break;
  }
};

export default handler;
