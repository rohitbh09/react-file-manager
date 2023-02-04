/* eslint-disable no-console */
import ApiController from './apiController';
import * as HttpStatus from '../../common/constants/httpStatus';
import { getToken } from '../middleware/middleware-passport';
import * as bcrypt from 'bcrypt';
class UserController extends ApiController {
  constructor (userRepository, logger) {
    super();
    this._userRepository = userRepository;
  }

  get UserRepository () {
    return this._userRepository;
  }

  async create (req, res) {
    const { name, userName, password } = req.body;
    if (!name || !userName || !password) {
      return res.status(HttpStatus.BadRequest).json({
        message: 'Please check name/ userName / password',
        output: false
      });
    }
  
    // check username is already exiest
    const user = await this.UserRepository.findOne({ userName: req.body.userName });
    if (user) {
      return res.status(HttpStatus.BadRequest).json({
        message: 'userName Already Exist',
        output: false
      });
    }
    const salt = await bcrypt.genSalt();
    console.log(await bcrypt.hash(password, salt));
    const userInfo = {
      name,
      userName,
      password: await bcrypt.hash(password, salt),
      salt: salt,
      isActive: true
    };

    try {
      const newUser = await this.UserRepository.create(userInfo);
      res.status(HttpStatus.Created).json(Object.assign({}, newUser.toJSON(), { password: null }));
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }

  async signIn (req, res) {
    let { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(HttpStatus.BadRequest).json({
        message: 'Please check userName/password',
        output: false
      });
    }
    try {
      const user = await this.UserRepository.findOne({ userName: req.body.userName });
      if (!user) {
        return res.status(HttpStatus.NotFound).json({
          message: 'User not found',
          output: false
        });
      }
      if (!user.isActive) {
        return res.status(HttpStatus.NotFound).json({
          message: 'User is not active',
          output: false
        });
      }
      const encryptedPassword = await bcrypt.hash(password, user.salt);
      if (encryptedPassword === user.password) {
        const token = getToken(user);
        let data = Object.assign({}, user.toJSON(), { token });
        // remove unwanted data 
        delete data.password;
        delete data.salt;
        delete data.__v;
        return res.status(HttpStatus.OK).json({
          data: data,
          output: true
        });
      } else {
        return res.status(HttpStatus.NotFound).json({
          message: 'User wrong password',
          output: false
        });
      }
    } catch (error) {
      return res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }

  async version (req, res) {
    try {
      res.status(HttpStatus.Created).json('Api version 1');
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }

  async profile (req, res) {
    try {
      let data = Object.assign({}, req.user.toJSON(), { password: null });
      delete data.password;
      delete data.salt;
      delete data.__v;
      res.status(HttpStatus.OK).json({ data, output: true });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }
}

export default UserController;