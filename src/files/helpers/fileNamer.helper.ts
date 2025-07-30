import { Request } from 'express';
import { v4 as uuid } from 'uuid';

interface FileNameCallback {
  (error: Error): void;
  (error: null, filename: string): void;
}

export const fileNamer = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileNameCallback
): void => {
  if (!file) {
    return callback(new Error('File is empty'));
  }

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
