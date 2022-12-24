import path from 'path';
import { ApplicationError } from '../../errors/application.error';
import ImageKit from 'imagekit';
import mime from 'mime';

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export async function saveImages(filename: string, file: Express.Multer.File) {
  try {
    const ext = '.' + mime.getExtension(file.mimetype);
    const result = await imageKit.upload({
      file: file.buffer,
      fileName: filename + ext,
      folder: '/cookbook/',
      useUniqueFileName: false,
    });
    const imgUrl = result.url;
    const imgSmallUrl = imageKit.url({ src: imgUrl, transformation: [{ width: 640 }] });
    return { imgUrl, imgSmallUrl };
  } catch (err) {
    throw new ApplicationError('UnknownError', 'Error uploading image');
  }
}

export async function removeImages(imgUrl: string) {
  if (!imgUrl.startsWith(process.env.IMAGEKIT_URL_ENDPOINT!)) {
    return;
  }
  try {
    const filename = path.basename(imgUrl);
    const file = (await imageKit.listFiles({ path: '/cookbook/', searchQuery: `name=${filename}`, limit: 1 }))[0];
    await imageKit.deleteFile(file.fileId);
  } catch (err) {
    throw new ApplicationError('UnknownError', 'Error deleting recipe image');
  }
}
