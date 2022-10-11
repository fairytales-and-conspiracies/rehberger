import AWS from 'aws-sdk';

const {
  INVOICE_UPLOAD_BUCKET_NAME,
  INVOICE_UPLOAD_ENDPOINT,
  S3_ACCESS_KEY_ID,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} = process.env;

const uploadFile = async (fileContent, keyName) => {
  const ep = new AWS.Endpoint(INVOICE_UPLOAD_ENDPOINT);
  const s3 = new AWS.S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    endpoint: ep,
    region: S3_REGION,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: INVOICE_UPLOAD_BUCKET_NAME,
    Key: keyName,
    Body: fileContent,
  };

  return s3.upload(params).promise();
};

export default uploadFile;
