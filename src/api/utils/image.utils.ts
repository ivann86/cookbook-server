import * as fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { ApplicationError } from '../../errors/application.error';

export function createNewImagesUrls(
  { imgUrl, imgSmallUrl }: { imgUrl: string; imgSmallUrl: string },
  protocol: string,
  hostname: string,
  port: string
) {
  if (imgUrl && !/https?:/.test(imgUrl)) {
    imgUrl = new URL(`${protocol}://${hostname}:${port}/images/${path.basename(imgUrl)}`).href;
  }
  if (imgSmallUrl && !/https?:/.test(imgSmallUrl)) {
    imgSmallUrl = new URL(`${protocol}://${hostname}:${port}/images/${path.basename(imgSmallUrl)}`).href;
  }

  return { imgUrl, imgSmallUrl };
}

export async function saveImages(filename: string, file: Express.Multer.File) {
  try {
    await sharp(file.buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg()
      .toFile(path.join(global.appRoot, 'static', 'images', filename + '.jpg'));
    await sharp(file.buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .jpeg()
      .toFile(path.join(global.appRoot, 'static', 'images', filename + '-small.jpg'));

    return { imgUrl: filename + '.jpg', imgSmallUrl: filename + '-small.jpg' };
  } catch (err) {
    console.log(err);
    throw new ApplicationError('UnknownError', 'Error saving image');
  }
}

export async function renameImages(filename: string, newFilename: string) {
  await fs.rename(
    path.join(global.appRoot, 'static', 'images', filename + '.jpg'),
    path.join(global.appRoot, 'static', 'images', newFilename + '.jpg')
  );
  await fs.rename(
    path.join(global.appRoot, 'static', 'images', filename + '-small.jpg'),
    path.join(global.appRoot, 'static', 'images', newFilename + '-small.jpg')
  );

  return { imgUrl: newFilename + '.jpg', imgSmallUrl: newFilename + '-small.jpg' };
}

export async function removeImages(filename: string) {
  await fs.rm(path.join(global.appRoot, 'static', 'images', filename + '.jpg'));
  await fs.rm(path.join(global.appRoot, 'static', 'images', filename + '-small.jpg'));
}
