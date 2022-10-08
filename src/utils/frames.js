import videos from '@/static-data/videos';
import { padZeroes } from '@/utils/string';

const getPadding = (frame) => {
  return videos[frame.video].frames > 999 ? 4 : 3;
};

export const getFrameName = (frame) => {
  const padding = getPadding(frame);
  return `${videos[frame.video].title} #${padZeroes(frame.frame, padding)}`;
};

export const getFrameFileName = (frame) => {
  const padding = getPadding(frame);
  return `${frame.video}_${padZeroes(frame.frame, padding)}`;
};

export const getPaddedFrameNumber = (frame) => {
  const padding = getPadding(frame);
  return padZeroes(frame.frame, padding);
};
