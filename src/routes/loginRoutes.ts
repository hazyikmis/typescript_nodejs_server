import { Router, Request, Response, NextFunction } from 'express';

//if we have more than one router files, its better to move this interface definition to a more centralized location
interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    //return next();
    next();
    return;
  }
  res.status(403);
  res.send('Not permitted!');
}

const router = Router();

// router.get('/', (req: Request, res: Response) => {
//   res.send('Hi there...');
// });
router.get('/login', (req: Request, res: Response) => {
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
});

/*
router.post("/login", (req: Request, res: Response) => {
  const {email, password} = req.body;
  //normally, since we are using typescript, it should be "TYPE_GUARD" before the line below
  //maybe, there is no "email" in the req.body. : SOLUTION IS DEFINING A NEW INTERFACE AS RequestWithBody WHICH EXTENDS Request
  //if (email) {...}
  res.send(email.toUpperCase());
}
*/

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;
  // if (email) {
  //   res.send(email.toUpperCase());
  // } else {
  //   res.send('You must provide an email');
  // }
  if (email && password && email === 'hi@hi.com' && password === 'pwd') {
    //mark this person as logged in
    req.session = { loggedIn: true };
    //redirect this person to the root route
    res.redirect('/');
  } else {
    res.send('Invalid email or password');
  }
});

router.get('/', (req: RequestWithBody, res: Response) => {
  if (req.session?.loggedIn) {
    res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <div>You are not logged in</div>
        <a href="/login">Login</a>
      </div>
    `);
  }
});

router.get('/logout', (req: RequestWithBody, res: Response) => {
  req.session = null;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: RequestWithBody, res: Response) => {
  res.send('Welcome to protected route, logged in user :)');
});

export { router };

//EXAMPLE WITH DECORATORS (This file could be designed as a controller class with decorators as shown below)
//There are 4 (main) types of decorators
//1.for routes, for ex: @post & @get
//2.for validation, for ex: @validateBody
//3.for applying middlewares, for ex: @use
//4.for marking class as being a controller, for ex: @controller

@controller('/auth') //all different routes in the class append its routes, for ex. "/auth/login"
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    //as you noticed, there is no "route" specified in the function!
    //bu as you noticed of course, "route" specified in/as decorator!
    res.send('form');
  }

  @post('/login')
  @validateBody('email', 'password')
  @use(requireAuth) //apply middleware
  postLogin(req: Request, res: Response): void {
    //as you noticed, there is no "route" specified in the function!
    //bu as you noticed of course, "route" specified in/as decorator!
    const { email, password } = req.body;
    if (email && password && email === 'hi@hi.com' && password === 'pwd') {
      //mark this person as logged in
      req.session = { loggedIn: true };
      //redirect this person to the root route
      res.redirect('/');
    } else {
      res.send('Invalid email or password');
    }
  }
}

//how to implement routing? how to say to "router" that "postLogin" function is your callback function
function post(routeName: string) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    router.post(routeName, target[key]);
  };
}

//how to implement middleware applications? how to inject this middleware to the post("/login") route?
function use(middleware: any) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    router.addMiddlewareToHandlerWeJustRegistered(middleware); //we need a function like that
  };
}
