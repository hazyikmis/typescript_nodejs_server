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
