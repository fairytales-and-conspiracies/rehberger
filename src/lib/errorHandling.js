import { Errors, ErrorTypes } from '@static-data/errors';

const sendError = (res, errorType) => {
  if (!Errors[errorType]) {
    res.status(400).json({
      success: false,
      error: Errors[ErrorTypes.UNEXISTING_ERROR_TYPE],
    });

    return;
  }

  res.status(400).json({
    success: false,
    error: Errors[errorType],
  });
};

export default sendError;
