import fs from 'fs';
import { IncomingMessage } from 'http'
import formidable from 'formidable';

export const cleanFiles = async (files: string[]) => {
  for (let file of files) {
    if (fs.existsSync(file)) {
      await fs.unlinkSync(file);
    }
  }
  return true;
}

export const parseMultipartNodeRequest = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}