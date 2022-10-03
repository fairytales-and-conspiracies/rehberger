/* eslint-disable import/prefer-default-export */
import videos from '@/static-data/videos';

export const getTokenIdFromFrame = (frame) => {
  if (!frame) {
    return null;
  }
  return videos[frame.video].previousVideoTokenEndingPoint + frame.frame;
};
