import { Request, Response, Router } from 'express';
import imageRoute from './api/image';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});
routes.use('/images', imageRoute);
export default routes;
