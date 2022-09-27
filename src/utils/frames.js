import videos from '@/static-data/videos';
import { padZeroes } from '@/utils/string';

export const getFrameName = (frame) => {
  const padding = videos[frame.video].frames > 999 ? 4 : 3;
  return `${videos[frame.video].title} ${padZeroes(frame.frame, padding)}`;
};
export const getFrameFileName = (frame) => {
  const padding = videos[frame.video].frames > 999 ? 4 : 3;
  return `${frame.video}_${padZeroes(frame.frame, padding)}`;
};
