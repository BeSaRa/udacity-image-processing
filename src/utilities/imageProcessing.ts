import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';

export class ImageProcessing {
  static FULL_PATH = ['public', 'assets', 'full'];
  static THUMBNAIL_PATH = ['public', 'assets', 'thumb'];

  /**
   * @description to check if the image exists in the full folder
   * @param imageName the image name without extension
   */
  static async existsInFull(imageName: string): Promise<boolean> {
    return ImageProcessing.imageExists(
      ImageProcessing.imageFullPath(imageName)
    );
  }

  /**
   * @description to check if the image exists in thumb folder
   * @param imageName image name without extension
   * @param width of the image
   * @param height of the image
   */
  static async existsInThumb(
    imageName: string,
    width: number,
    height: number
  ): Promise<boolean> {
    return ImageProcessing.imageExists(
      ImageProcessing.imageThumbPath(imageName, width, height)
    );
  }

  /**
   * @description generate image path in full folder
   * @param imageName image name without extension
   */
  static imageFullPath(imageName: string): string {
    return path.resolve(...ImageProcessing.FULL_PATH, imageName) + '.png';
  }

  /**
   * @description generate image path in thumb folder
   * @param imageName image name without extension
   * @param width of the image
   * @param height of the image
   */
  static imageThumbPath(imageName: string, width: number, height: number) {
    return (
      path.resolve(
        ...ImageProcessing.THUMBNAIL_PATH,
        [imageName, width, height].join('_')
      ) + '.png'
    );
  }

  /**
   * @description create thumbnail for the gaven image name with the specified size (width,height)
   * @param imageName
   * @param width
   * @param height
   * @returns imageThumbPath path for the created thumbnail
   */
  static async createThumbImage(
    imageName: string,
    width: number,
    height: number
  ): Promise<string> {
    await sharp(ImageProcessing.imageFullPath(imageName))
      .resize(width, height)
      .toFile(ImageProcessing.imageThumbPath(imageName, width, height));
    return ImageProcessing.imageThumbPath(imageName, width, height);
  }

  /**
   * @description check if the image exists for the given path
   * @param imagePath
   * @private
   */
  private static async imageExists(imagePath: string): Promise<boolean> {
    let result = false;
    try {
      const file = await fs.open(imagePath, 'r');
      result = true;
      await file.close();
    } catch (e) {
      console.log('Chosen Image not exists');
    }
    return result;
  }

  /**
   * @description to create thumbnail image if not exists with the same dimensions in thumb folder
   * and if it exists return the image path on the thumb folder instead of create another one
   * @param imageName
   * @param width
   * @param height
   */
  static async createThumbIfNotExists(
    imageName: string,
    width: number,
    height: number
  ): Promise<string> {
    width = isNaN(width) ? 200 : width;
    height = isNaN(height) ? 200 : height;
    if (await ImageProcessing.existsInThumb(imageName, width, height)) {
      return ImageProcessing.imageThumbPath(imageName, width, height);
    } else if (await ImageProcessing.existsInFull(imageName)) {
      return ImageProcessing.createThumbImage(imageName, width, height);
    } else {
      return '';
    }
  }
}
