import jwt, { Secret } from 'jsonwebtoken';

export const generateToken = (userId: string, role: string) => {
  const secret: Secret = process.env.JWT_SECRET || 'secret';
  // jsonwebtoken v9 expects expiresIn to be a string or number, not undefined/null
  const expiresIn: string = (process.env.JWT_EXPIRE && typeof process.env.JWT_EXPIRE === 'string') ? process.env.JWT_EXPIRE : '7d';
  return jwt.sign(
    { userId, role },
    secret,
    { expiresIn: expiresIn as import('ms').StringValue }
  );
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
