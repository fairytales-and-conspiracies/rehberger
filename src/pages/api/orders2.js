import dbConnect from '@/lib/dbConnect';

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      res.status(201).json({ success: true, data: 'lala' });
      break;
    default:
      res.status(400).json({ success: false, err: `Error 3` });
      break;
  }
};

export default handler;
