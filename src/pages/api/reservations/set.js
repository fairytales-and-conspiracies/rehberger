import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Frame from '@/models/Frame';
import { ErrorTypes } from '@/static-data/errors';
import { orderFramesMongoFilter } from '../orders';

const { RESERVATION_EXPIRY_TIME_MINUTES } = process.env;

const createReservations = async (req) => {
  const { email, frames } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const framesFilter = orderFramesMongoFilter(frames);

    const query = {
      $or: [
        {
          ...framesFilter,
          sold: false,
          reservedBy: null,
        },
        {
          ...framesFilter,
          reservedBy: email,
        },
      ],
    };

    const reservableFrames = await Frame.find(query).session(session);

    const reservableFramesFilter = orderFramesMongoFilter(reservableFrames);

    await Frame.updateMany(
      reservableFramesFilter,
      {
        reservedBy: email,
        reservedUntil: new Date(
          new Date().getTime() + RESERVATION_EXPIRY_TIME_MINUTES * 60000
        ),
      },
      { session }
    );

    await session.commitTransaction();
    return reservableFrames;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res
      .status(400)
      .json({ success: false, error: ErrorTypes.METHOD_NOT_ALLOWED });
    return;
  }

  await dbConnect();

  const reservations = await createReservations(req);
  res.status(200).json({ success: true, reservations });
};

export default handler;
