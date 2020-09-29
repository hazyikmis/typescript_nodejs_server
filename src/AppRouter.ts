import express from 'express';

//In our app, there should be one copy of a router at a time!
export class AppRouter {
  //static: accessible without creating instance of class
  //private: nobody outside of this class can access
  private static instance: express.Router;

  static getInstance(): express.Router {
    if (!AppRouter.instance) {
      AppRouter.instance = express.Router();
    }

    return AppRouter.instance;
  }
}
