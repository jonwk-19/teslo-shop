import { FileFilterCallback } from 'multer';
import { Request } from 'express';

export const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {

  if (!file) return callback(new Error('File is empty'));

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};
