export const ErrorTypes = {
  UNEXISTING_ERROR_TYPE: 0,
  GENERIC_ERROR: 1,
  INCORRECT_SECURITY_QUESTION_ANSWER: 2,
  NO_ORDER_FOUND: 3,
};

export const Errors = {
  [ErrorTypes.GENERIC_ERROR]: {
    type: 'GenericError',
    message: 'There has been an error.',
  },
  [ErrorTypes.UNEXISTING_ERROR_TYPE]: {
    type: 'UnexistingErrorTypeOnBackend',
    message: 'Error type does not exist - backend only.',
  },
  [ErrorTypes.INCORRECT_SECURITY_QUESTION_ANSWER]: {
    type: 'IncorrectSecurityQuestionAnswer',
    message: 'Incorrect answer. Please try a different one.',
  },
  [ErrorTypes.NO_ORDER_FOUND]: {
    type: 'NoOrderFound',
    message: 'Incorrect order number.',
  },
};
