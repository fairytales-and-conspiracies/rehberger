import dbConnect from '@/lib/dbConnect';
import Frame from '@/models/Frame';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const frames = await Frame.find({ query });
        res.status(200).json({ success: true, data: frames });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
