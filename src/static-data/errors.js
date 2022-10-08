export const ErrorTypes = {
  UNEXISTING_ERROR_TYPE: 0,
  GENERIC_ERROR: 1,
  INCORRECT_SECURITY_QUESTION_ANSWER: 2,
  NO_ORDER_FOUND: 3,
  TRANSACTION_CREATION_UNSUCCESSFUL: 4,
  METHOD_NOT_ALLOWED: 5,
  STRIPE_DOUBLE_UPDATE: 6,
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
  [ErrorTypes.TRANSACTION_CREATION_UNSUCCESSFUL]: {
    type: 'TransactionCreationUnsuccessful',
    message: 'Transaction has not been created.',
  },
  [ErrorTypes.METHOD_NOT_ALLOWED]: {
    type: 'MethodNotAllowed,',
    message: 'Method not allowed.',
  },
  [ErrorTypes.STRIPE_DOUBLE_UPDATE]: {
    type: 'StripeDoubleUpdate,',
    message: 'Stripe order has already been updated.',
  },
};
