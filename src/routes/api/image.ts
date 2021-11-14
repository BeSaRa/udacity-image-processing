import { Request, Response, Router } from 'express';
import { ImageProcessing } from '../../utilities/imageProcessing';
import { IImageInformation } from '../../interfaces/i-image-information';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

const imageRoute = Router();
imageRoute.get('/', async (req: Request, res: Response): Promise<void> => {
  const {
    filename,
    width = '200',
    height = '200',
  }: Partial<IImageInformation> = req.query;
  const image = await ImageProcessing.createThumbIfNotExists(
    filename,
    parseInt(width),
    parseInt(height)
  );
  image.length ? res.sendFile(image) : res.send('Image not exists');
});

imageRoute.post('/upload', (req: Request, res: Response) => {
  if (!req.files || !Object.keys(req.files).length) {
    res.status(400).send('please provide files to upload ');
    return;
  }
  const { files = [] }: { files?: UploadedFile[] } = req.files;
  const uplodedPromise = files.map((file) =>
    file.mv(path.resolve(...ImageProcessing.FULL_PATH, file.name))
  );
  Promise.all(uplodedPromise).then(() => {
    res.sendStatus(200);
  });
});
export default imageRoute;
