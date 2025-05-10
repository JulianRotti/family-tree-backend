import fs from 'fs';
import path from 'path';

export const saveImageAndReturnUrl = async (req) => {
  if (!req.file) throw new Error('No file provided');
  const uploadPath = getPath(req.file, req.body.first_name, req.body.last_name, req.body.birth_date, 'uploads');
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadPath, req.file.buffer, (err) => {
      if (err) return reject(err);
      resolve(uploadPath);
    });
  });
};

const getPath = (file, firstName, lastName, birthDate, folder) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${firstName}-${lastName}-${birthDate}${extension}`;
    return path.join(folder, fileName);
}