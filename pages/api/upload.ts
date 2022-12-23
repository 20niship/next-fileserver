import fs from 'fs';
import busboy from 'busboy';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST'){
    res.status(404).end();
    return;
  }

  const bb = busboy({ headers: req.headers });
  let dirname = "";
  bb.on('field', function(fieldname, val) {
    console.log('Field [' + fieldname + ']: value: ' + val);
    if (fieldname === "dirname") dirname = val;
  });

  bb.on('file', (fieldname, file, info) => {
    const fname = decodeURIComponent (info.filename);
    const location = process.env.SRC_DIR + "/" + dirname + "/" + fname;
    file.pipe(fs.createWriteStream(location));
    // console.log(
    //   'File [' + fieldname + ']: filename: ' + name + ', encoding: ' + encoding + ', mimetype: ' + mimetype,
    // );
    // file.on('data', function(data) {
    //   console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    // });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
      // res.status(200);
      // res.json({ status: "success" });
    });
  });

  bb.on('finish', function() {
    console.log('Done parsing form!');
  });
  bb.on('close', () => {
    res.status(200);
    res.json({ status: "success" });
  });
  req.pipe(bb);
};
