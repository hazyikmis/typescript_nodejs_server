# Installations & Initial Configurations

```
npm init -y
tsc --init
npm install concurrently nodemon
```

Uncomment the lines as below, and change accordingly in tsconfig.json

```
"outDir": "./build"
"rootDir": "./src"
```

Change the "scripts" section of package.json as below:

```
"scripts": {
  "start:build": "tsc -w",
  "start:run": "nodemon build/index.js",
  "start": "concurrently npm:start:*"
}
```

Create index.ts under ./src folder and just put one line "console.log('something')"

On the terminal, execute "npm start". At first execution, some errors are highly possible (because there is no build version of index.ts available yet).

Install 3 npm packages:

```
npm install express body-parser cookie-session
//the adapter files (type definition files of these libs should be also installed!)
npm install @types/express @types/body-parser @types/cookie-session
```

# Attention! Type Definition Files are not always PERFECT!

https://www.udemy.com/course/typescript-the-complete-developers-guide/learn/lecture/15067118

If we comment the line "app.use(bodyParser);" (do not use body-parser), "const {email, password} = req.body;" line in the loginRoutes.ts files still does not throw an error. Because, when we removed body-parser, the "req" object do not has a "body" attribute. But the people prepared type definition file for express made a huge assumption and implemented that "request" always has a "body: any" attribute.

Maybe, rather than defining "body: any;" it might be better to define (in index.d.ts) - BUT DO NOT DO THAT! - its a type definition file and might affect other files:

```
body: {[key: string]: string | undefined};
```

# Decorators:

EXAMPLE WITH DECORATORS (routes/loginRoutes.ts file could be designed as a controller class with decorators as shown below)

```
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

```
