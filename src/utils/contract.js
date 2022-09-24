/* eslint-disable import/prefer-default-export */
import videos from '@/static-data/videos';

export const getTokenId = (frame) => {
  return videos[frame.video].previousVideoTokenEndingPoint + frame.frame;
};
