import { Router, Response, Request } from 'express';
import imageRoute from './api/image';

const routes = Router();
routes.get('/', (req: Request, res: Response) => {
  res.send(200);
});
routes.use('/image', imageRoute);

export default routes;
