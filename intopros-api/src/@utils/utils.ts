import fs from 'fs';

export const generatePassword = (length = 10) => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return password;
};

export const generateSlug = (title: string, addRandomNumber?: boolean) => {
  const wipTitle = title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/  +/g, ' ')
    .replace(/ /g, '-');

  const randNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return addRandomNumber ? `${wipTitle}-${randNum}` : wipTitle;
};

export const removeFile = (path: string) => {
  if (!path) return;

  // We need to get actual path to remove the file
  const actualPath = `.${path}`;

  if (fs.existsSync(actualPath)) {
    fs.unlinkSync(actualPath);
  }
};
