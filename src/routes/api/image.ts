import { Request, Response, Router } from 'express';
import { ImageProcessing } from '../../utilities/imageProcessing';
import { IImageInformation } from '../../interfaces/i-image-information';

const imageRoute = Router();
imageRoute.get('/', async (req: Request, res: Response): Promise<void> => {
  const {
    filename,
    width = '200',
    height = '200',
  }: Partial<IImageInformation> = req.query;
  console.log(parseInt(width), parseInt(height));
  const image = await ImageProcessing.createThumbIfNotExists(
    filename,
    parseInt(width),
    parseInt(height)
  );
  image.length ? res.sendFile(image) : res.send('Image not exists');
});
export default imageRoute;
