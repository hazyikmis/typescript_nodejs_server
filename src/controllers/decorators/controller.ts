import 'reflect-metadata';
//import express from 'express';
import { AppRouter } from '../../AppRouter';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';
import { NextFunction, Request, RequestHandler, Response } from 'express';

//this is not good place to define router!!!
//because of that, AppRouter imported and used inside the decorator function below, rather than the router defined below
//export const router = express.Router();

//this factory function generates the middlewares (according to the keys) and appends them to "middlewares" defined in "function controller"
function bodyValidators(keys: string): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    //first check the existance of "body"
    if (!req.body) {
      res.status(422).send('Invalid Request');
      return;
    }
    //then check the existance of keys
    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing property ${key}!`);
        return;
      }
    }
    next();
  };
}

export function controller(routePrefix: string) {
  //here below is the actual decorator function
  //target: we don't know which constructor function which we will pass through
  return function (target: Function) {
    const router = AppRouter.getInstance();
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];

      // const path = Reflect.getMetadata('path', target.prototype, key);
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );

      //const method = Reflect.getMetadata('method', target.prototype, key); //method is : get, put, post, delete, etc
      const method: Methods = Reflect.getMetadata(
        // 'method',
        MetadataKeys.method,
        target.prototype,
        key
      ); //method is : get, put, post, delete, etc

      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      const requiredBodyProps =
        Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) ||
        [];

      const validator = bodyValidators(requiredBodyProps); //like middlewares

      if (path) {
        //router.get(`${routePrefix}${path}`, routeHandler);
        //router[method](`${routePrefix}${path}`, routeHandler);
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler
        );
      }
    }
  };
}

// so now for every key we're going to look up target.prototype at key we're gonna try
// to see if that's a method that has some amount of middleware if it does.
// We're going to pull off that root property and associate it with some router so
// we'll say target.prototype at key going to sign that to some little temporary
// variable here I'm going to call it simply method so let's call it root handler instead.
