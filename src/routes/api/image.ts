import { Request, Response, Router } from 'express';
import { ImageProcessing } from '../../utilities/imageProcessing';
import { IImageInformation } from '../../interfaces/i-image-information';

const imageRoute = Router();
imageRoute.get('/', async (req: Request, res: Response): Promise<void> => {
  const {
    filename,
    width = 200,
    height = 200,
  }: Partial<IImageInformation> = req.query;
  const image = await ImageProcessing.createThumbIfNotExists(
    filename,
    Number(width),
    Number(height)
  );
  image.length ? res.sendFile(image) : res.send('Image not exists');
});
export default imageRoute;
