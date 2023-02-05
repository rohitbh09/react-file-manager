import BaseRouter from './baseRouter';
import { authenticated } from '../middleware/middleware-security';

class FileRouter extends BaseRouter {
  constructor (
    fileRepository,
    fileController
  ) {
    super(fileController);
    this.Router.use(authenticated());
    this.Router.route('/')
      .get(async (req, res) => this.Controller.list(req, res));
    this.Router.route('/create')
      .post(async (req, res) => this.Controller.create(req, res));
    this.Router.route('/upload')
      .post(async (req, res) => this.Controller.upload(req, res));
    this.Router.route('/:fileId')
      .delete(async (req, res) => this.Controller.delete(req, res));
    this.Router.route('/version')
      .get(async (req, res) => this.Controller.version(req, res));
  }
}

export default FileRouter;