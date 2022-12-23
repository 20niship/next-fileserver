import { remove } from '../../lib/api';
import type { NextApiRequest, NextApiResponse } from 'next'

interface Request extends NextApiRequest {
  body: {
    path?: string
  };
}


export default async (req: Request, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }
  if (req.body?.path == undefined) {
    res.status(500).end();
    return;
  } else {
    const { path } = req.body;
    const r = await remove(path);
    console.log(path, r)
    res.status(200).json(r);
  }
}

