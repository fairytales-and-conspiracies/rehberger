export const formatDateForInvoiceNameFromTimestamp = (timestamp) => {
  const dateTime = new Date(timestamp);
  const [date] = dateTime.toISOString().split('T');
  return date;
};
