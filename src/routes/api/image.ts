import express from 'express';

const imageRoute = express.Router();

imageRoute.get('/', (req: express.Request, res: express.Response): void => {
  res.send('Image API');
});
export default imageRoute;
