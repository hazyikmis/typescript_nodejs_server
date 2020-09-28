//import express, { Request, Response } from 'express';
import express from 'express';
import { router as loginRouter } from './routes/loginRoutes';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//"bodyParser" middleware adds "body" to request object
app.use(cookieSession({ keys: ['qwerty'] }));
//"cookieSession" middleware adds "session" to request object

// app.get('/', (req: Request, res: Response) => {
//   res.send(`
//     <div>
//       <h1>Hi there!</h1>
//     </div>
//   `);
// });

app.use(loginRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
