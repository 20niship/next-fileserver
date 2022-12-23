// Tell Next.js to pass in Node.js HTTP
export const config = {
   api: { externalResolver: true }
}

import express from 'express';
const handler = express();

const SRC = process.env.SRC_DIR || "../";

const serveFiles = express.static(SRC);
handler.use(['/api/media/', SRC], serveFiles);

export default handler;
