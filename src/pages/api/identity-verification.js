import nextConnect from 'next-connect';
import multer from 'multer';

import dbConnect from '@/lib/dbConnect';
import sendMail from '@/lib/sendMail';
import IdentityVerification from '@/models/IdentityVerification';
import emailTypes from '@/static-data/email-types';

const { UPLOADED_FILES_DIRECTORY } = process.env;

const upload = multer({
  storage: multer.diskStorage({
    destination: `${UPLOADED_FILES_DIRECTORY}`,
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const handler = nextConnect({
  onError(error, req, res) {
    res.status(501).json({
      success: false,
      error: { message: `Something happened! ${error.message}` },
    });
  },
  onNoMatch(req, res) {
    res.status(405).json({
      success: false,
      error: { message: `Method '${req.method}' Not Allowed` },
    });
  },
});

handler.use(upload.array('files'));

handler.post(async (req, res) => {
  await dbConnect();

  const { confirmationKey, walletAddress } = req.body;

  try {
    const { path: file1Url } = req.files[0];
    const { path: file2Url } = req.files[1];

    const data = {
      file1Url,
      file2Url,
      confirmationKey,
      walletAddress,
    };

    await IdentityVerification.create(data);

    sendMail(emailTypes.SecurityQuestionForgotten, data, [
      {
        path: file1Url,
      },
      {
        path: file2Url,
      },
    ]);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
