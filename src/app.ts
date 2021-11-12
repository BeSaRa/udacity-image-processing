import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';

const app = express();
const port = 5000;
// serve the static files
app.use(express.static('public'));
// the main route for our api
app.use('/api', routes);
// handle page/routes not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  res.redirect('/404.html');
  next();
});
// server start on specified port
app.listen(port, () => {
  console.log('Server Running on port:', port);
});
