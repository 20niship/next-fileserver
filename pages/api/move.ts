import { move } from '../../lib/api';
import type { NextApiRequest, NextApiResponse } from 'next'

interface Request extends NextApiRequest {
  body: {
    from?: string,
    to?: string
  };
}

export default async (req: Request, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }
  if ("from" in req.body && "to" in req.body) {
    const { from, to } = req.body;
    if (from == undefined || to == undefined) {
      res.status(500).end();
      return;
    }
    const r = await move(from, to);
    res.status(200).json(r);
  }
  res.status(500).end();
  return;
}

