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
