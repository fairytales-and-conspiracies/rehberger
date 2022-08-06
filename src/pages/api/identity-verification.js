import fs from 'fs';
import nextConnect from 'next-connect';
import multer from 'multer';

import dbConnect from '@lib/dbConnect';
import IdentityVerification from '@models/IdentityVerification';

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

  const { orderNumber, walletAddress } = req.body;

  try {
    await IdentityVerification.create({
      file1Url: req.files[0].path,
      file2Url: req.files[1].path,
      orderNumber,
      walletAddress,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const handler2 = { post: () => {} };
handler2.post(async (req, res) => {
  await dbConnect();

  console.log(req.body);
  console.log(req.files);

  try {
    const [file1, file2] = req.files.files;
    const {
      orderNumber: [orderNumber],
      walletAddress: [walletAddress],
    } = req.body;

    let buffer = await streamToBuffer(file1);
    const file1Url = `/Users/nikolabulatovic/Downloads/rehberger/${file1.originalFilename}`;
    fs.writeFileSync(file1Url, buffer);

    buffer = await streamToBuffer(file2);
    const file2Url = `/Users/nikolabulatovic/Downloads/rehberger/${file1.originalFilename}`;
    fs.writeFileSync(file2Url, buffer);

    const idVerification = await IdentityVerification.create({
      file1Url,
      file2Url,
      orderNumber,
      walletAddress,
    });
    res.status(200).json({ success: true, data: idVerification });
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
