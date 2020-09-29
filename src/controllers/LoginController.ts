import { Request, Response, NextFunction } from 'express';
// import { get } from './decorators/routes';
// import { controller } from './decorators/controller';
//rather than importing each file separately, we have created an index file inside controllers folder
//import { get, controller } from './decorators';
import { get, controller, use, bodyValidator, post } from './decorators';

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

  @post('/login')
  @bodyValidator('email', 'password')
  postLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    //NOW, WE DO NOT NEED TO CHECK email && password IF THEY ARE UNDEFINED OR NOT BELOW
    //BECAUSE WE INJECTED @bodyValidator('email', 'password') DECORATOR
    if (email && password && email === 'hi@hi.com' && password === 'pwd') {
      //mark this person as logged in
      req.session = { loggedIn: true };
      //redirect this person to the root route
      res.redirect('/');
    } else {
      res.send('Invalid email or password');
    }
  }

  @get('/logout')
  getLogout(req: Request, res: Response) {
    req.session = null;
    res.redirect('/');
  }
}

//@use(middleware)
//we're going to store some metadata on this request handler (getLogin) and then
//wired up to our router from the controller decorator.
