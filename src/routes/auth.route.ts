import { Router } from 'express';
import AuthController from '@src/controllers/auth.controller';

const authController = new AuthController();

const ROUTE_PREFIX = '/auth';

export default (): Router => {
  const router = Router();

  router.post(`${ROUTE_PREFIX}/register`, authController.register);
  router.post(`${ROUTE_PREFIX}/login`, authController.login);

  return router;
};
