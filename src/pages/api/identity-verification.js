import nextConnect from 'next-connect';
import multer from 'multer';

import dbConnect from '@/lib/dbConnect';
import IdentityVerification from '@/models/IdentityVerification';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
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
    await IdentityVerification.create({
      file1Url: req.files[0].path,
      file2Url: req.files[1].path,
      confirmationKey,
      walletAddress,
    });

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
