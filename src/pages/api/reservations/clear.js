import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import Frame from '@/models/Frame';
import { ErrorTypes } from '@/static-data/errors';
import { orderFramesMongoFilter } from '../orders';

const clearReservations = async (req) => {
  const { email, frames } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const framesFilter = orderFramesMongoFilter(frames);

    const unreservableFrames = await Frame.find({
      ...framesFilter,
      reservedBy: email,
    }).session(session);

    const unreservableFramesFilter = orderFramesMongoFilter(unreservableFrames);

    await Frame.updateMany(
      unreservableFramesFilter,
      {
        reservedBy: null,
        reservedUntil: null,
      },
      { session }
    );

    await session.commitTransaction();
    return unreservableFrames;
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

  const reservations = await clearReservations(req);
  res.status(200).json({ success: true, reservations });
};

export default handler;
