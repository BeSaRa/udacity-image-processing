import { Router, Response, Request } from 'express';
import imageRoute from './api/image';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.send('API DONE!!');
});

routes.use('/image', imageRoute);
export default routes;
