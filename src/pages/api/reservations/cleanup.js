import mongoose from 'mongoose';
import Frame from '@/models/Frame';
import { orderFramesMongoFilter } from '../orders';

const cleanupReservations = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reservedFilter = { reservedBy: { $nin: [null] } };
    const reservedFrames = await Frame.find(reservedFilter).session(session);
    const expiredFrames = reservedFrames.filter(
      (frame) => new Date(frame.reservedUntil) < new Date()
    );
    const expiredFramesFilter = orderFramesMongoFilter(expiredFrames);

    await Frame.updateMany(
      expiredFramesFilter,
      {
        reservedBy: null,
        reservedUntil: null,
      },
      { session }
    );

    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
};

export default cleanupReservations;
