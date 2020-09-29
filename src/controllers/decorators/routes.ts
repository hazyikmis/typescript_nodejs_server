//We want you to find some metadata on the target at key that says hey we're
//trying to associate some like path to be kind of wired up to our router at
//some point time in the future. So inside of here we need to make use of that metadata package.

import 'reflect-metadata';
import { Methods } from './Methods';

//creating & exporting for each REST API is a one way of solution, but super code duplication exists!
/*
export function get(path: string) {
  //below is the actual decorator function
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata('path', path, target, key);
    Reflect.defineMetadata('method', 'get', target, key);
  };
}

export function post(path: string) {
  //below is the actual decorator function
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata('path', path, target, key);
    Reflect.defineMetadata('method', 'post', target, key);
  };
}
*/
//creating & exporting for each REST API is a one way of solution, but super code duplication exists!

//lets refactor
function routeBinder(method: string) {
  return function (path: string) {
    //below is the actual decorator function
    return function (target: any, key: string, desc: PropertyDescriptor) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', method, target, key);
    };
  };
}

// export const get = routeBinder('get');
// export const put = routeBinder('put');
// export const post = routeBinder('post');
// export const del = routeBinder('delete');
// export const patch = routeBinder('patch');

//lets create Methods enum type and use it, (check the Methods.ts)

export const get = routeBinder(Methods.get);
export const put = routeBinder(Methods.put);
export const post = routeBinder(Methods.post);
export const del = routeBinder(Methods.del);
export const patch = routeBinder(Methods.patch);
