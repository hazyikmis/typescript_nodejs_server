import express from 'express';
import { router as loginRouter } from './routes/loginRoutes';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

import './controllers/LoginController';
//import { router as controllerRouter } from './controllers/decorators/controller'; //NO NEED TO IMPORT THIS ANYMORE, WE HAVE ONLY AppRouter
import { AppRouter } from './AppRouter';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['qwerty'] }));
app.use(loginRouter);
//app.use(controllerRouter);
app.use(AppRouter.getInstance());

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
