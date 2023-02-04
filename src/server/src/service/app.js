import express from 'express';
import multipart from 'connect-multiparty';
import middlewareLogging from './middleware/middleware-logger';
import middlewarePassport from './middleware/middleware-passport';
import middlewareRequestParser from './middleware/middleware-request-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../config/doc/swagger.json';
import path from 'path';
// #region Common components
import ModelOfTRepository from '../data/repositories/modelOfTRepository';
import middlewareCors from './middleware/middleware-cors';
// #endregion

// #region User
import UserModel from '../data/models/userModel';
import UserController from '../service/controllers/userController';
import UserRouter from '../service/routes/userRouter';

// #File Router
import FileModel from '../data/models/fileModel';
import FileController from '../service/controllers/fileController';
import FileRouter from '../service/routes/fileRouter';
// #endregion

export default async function (
  logger,
  dbConnection,
  corsConfig,
  securityConfig
) {
  const app = express();
  const multipartMiddleware = multipart();

  const userRepository = new ModelOfTRepository(UserModel(dbConnection));
  const userController = new UserController(userRepository, logger);
  const userRouter = new UserRouter(userRepository, userController);

  const fileRepository = new ModelOfTRepository(FileModel(dbConnection));
  const fileController = new FileController(fileRepository, logger);
  const fileRouter = new FileRouter(fileRepository, fileController);


  middlewareLogging(app, logger);
  middlewareRequestParser(app);
  middlewarePassport(app, userRepository, securityConfig);
  middlewareCors(app, corsConfig);

  const apiRouter = express.Router();
  app.use(multipartMiddleware);
  app.use('/scripts', express.static(path.join(__dirname, './scripts')));
  apiRouter.use('/user', userRouter.Router);
  apiRouter.use('/file', fileRouter.Router);
  app.use('/api', apiRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app;
}
