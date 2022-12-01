import { getTokenIdFromFrame } from '@/utils/contract';

export const getSuccessfulFramesFromContractCallWithReturnTokensEvent = (
  tx,
  allFrames
) => {
  const tokensAsStrings = tx?.events?.returnTokens?.returnValues?.tokens;
  const tokens = tokensAsStrings.map((tokenStr) => {
    const token = parseInt(tokenStr, 10);
    return token;
  });

  const successfulFrames =
    tokens && tokens.length > 0
      ? allFrames.filter((frame) => tokens.includes(getTokenIdFromFrame(frame)))
      : [];

  return successfulFrames;
};
