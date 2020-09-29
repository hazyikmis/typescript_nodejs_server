//if you check out the file "loginRoutes.ts", you'll see "const { email, password } = req.body;"  -- with a huge assumption
//now we are going to try validating req.body includes email & password
import 'reflect-metadata';
import { MetadataKeys } from './MetadataKeys';

//since we are going to try validating more than one properties, we have used "...keys" syntax
//for example: bodyValidator('email', 'password', 'passwordConfirmation')
export function bodyValidator(...keys: string[]) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
  };
}

//now take this bodyValidator (decorator) and apply it to some route handlers
