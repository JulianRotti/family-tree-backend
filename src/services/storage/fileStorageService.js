import * as local from './localStorage.js';
import * as s3 from './s3Storage.js';

const provider =
    process.env.STORAGE_PROVIDER === 's3' ? s3 : local; 

export const { saveImageAndReturnUrl } = provider;
