import { view } from '../../lib/api';

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
  }
  const path = req.body.path;
  let l = await view(path)
  res.status(200).json(l);
}



