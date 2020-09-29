import { Request, Response, NextFunction } from 'express';
// import { get } from './decorators/routes';
// import { controller } from './decorators/controller';
//rather than importing each file separately, we have created an index file inside controllers folder
//import { get, controller } from './decorators';
import { get, controller, use } from './decorators';

function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request was made!');
  next();
}

//"@controller" decorator prefixes all routes defined in the class
@controller('/auth')
class LoginController {
  @get('/login')
  @use(logger)
  getLogin(req: Request, res: Response) {
    res.send(`
      <form method="POST">
        <div>
            <label>Email</label>
            <input name="email" />
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" />
          </div>
        <button>Submit</button>
      </form>
    `);
  }
}

//@use(middleware)
//we're going to store some metadata on this request handler (getLogin) and then
//wired up to our router from the controller decorator.
