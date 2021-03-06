import { Request, Response, Router } from 'express';
import { ImageProcessing } from '../../utilities/imageProcessing';
import { IImageInformation } from '../../interfaces/i-image-information';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { promises as fs } from 'fs';
import { Validator } from '../../utilities/validator';

const imageRoute = Router();
imageRoute.get('/', async (req: Request, res: Response): Promise<void> => {
  const { filename, width, height }: Partial<IImageInformation> = req.query;
  if (
    !Validator.hasValue(filename) ||
    !Validator.hasValue(width) ||
    !Validator.hasValue(height)
  ) {
    res
      .status(400)
      .send('Please Provide value for all Params filename, width and height');
  } else if (!Validator.isNumber(width) || !Validator.isNumber(height)) {
    res
      .status(400)
      .send('Please make sure that width and height numeric values');
    return;
  } else if (
    !Validator.isPositiveNumber(width) ||
    !Validator.isPositiveNumber(height)
  ) {
    res
      .status(400)
      .send('Please make sure that width and height Positive values');
    return;
  }
  try {
    const image = await ImageProcessing.createThumbIfNotExists(
      filename,
      parseInt(width ? width : '0'),
      parseInt(height ? height : '0')
    );
    image.length
      ? res.sendFile(image)
      : res.status(400).send('Image not exists');
  } catch (e) {
    console.log(e);
    res.status(500).send('error happened while processing your request');
  }
});

imageRoute.get('/full', async (req: Request, res: Response) => {
  try {
    res.send(await fs.readdir(path.resolve(...ImageProcessing.FULL_PATH)));
  } catch (e) {
    res.status(500).send('cannot scan the full folder');
  }
});

imageRoute.post('/upload', (req: Request, res: Response) => {
  if (!req.files || !Object.keys(req.files).length) {
    res.status(400).send('please provide files to upload ');
    return;
  }
  const { files = [] }: { files?: UploadedFile[] } = req.files;

  const uploadedPromise = []
    .concat(files)
    .map((file) =>
      file.mv(path.resolve(...ImageProcessing.FULL_PATH, file.name))
    );
  Promise.all(uploadedPromise).then(() => {
    res.sendStatus(200);
  });
});

imageRoute.get('/thumbnails', async (req: Request, res: Response) => {
  const directoryName = path.resolve(...ImageProcessing.THUMBNAIL_PATH);
  try {
    res.send(await fs.readdir(directoryName));
  } catch (e) {
    await fs.mkdir(directoryName); //create the directory if not exists
    res.send([]); // return empty array cause the directory is empty
  }
});
export default imageRoute;
