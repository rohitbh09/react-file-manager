/* eslint-disable no-console */
import ApiController from './apiController';
import * as HttpStatus from '../../common/constants/httpStatus';
import * as localPath from 'path';
import uuid from 'uuid';
import { existsSync } from 'fs';
import { mkdir, rename, rm } from 'fs/promises';
const uploadPath = '../../../../../upload/';

class FileController extends ApiController {
  constructor (fileRepository, logger) {
    super();
    this._fileRepository = fileRepository;
  }

  get FileRepository () {
    return this._fileRepository;
  }

  async create (req, res) {
    // check and create folder
    const { _id } = req.user || {};
    const parentId = req.body.parentId || '';
    const folderName = req.body.folderName || '';
    let internalPath = `${uploadPath}${_id}/`;
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
    console.log('folderName', folderName, re.test(folderName));
    if (!folderName) {
      return res.status(HttpStatus.BadRequest).json({
        message: 'Folder Name Requied',
        output: false
      });
    }
    // if (!re.test(folderName)) {
    //   return res.status(HttpStatus.InternalServerError).json({
    //     message: 'Only Use Alpha Numeric',
    //     output: false
    //   });
    // }

    if (parentId) {
      const folder = await this.FileRepository.getById(parentId);
      if (!folder) {
        return res.status(HttpStatus.BadRequest).json({
          message: 'Folder Parent Not Found',
          output: false
        });
      }
      console.log('Check Parent Path', folder);
      internalPath = `${folder.internalPath}/`;
    }

    try {
      // check folder exist
      const fullPath = localPath.join(__dirname, `${internalPath}${folderName}`)
      const fileExists = existsSync(fullPath);
      if (fileExists) {
        return res.status(HttpStatus.BadRequest).json({
          message: 'Folder Already Exists',
          output: false
        });
      }

      const createDir = await mkdir(fullPath, { recursive: true });
      console.log('[folderCreated]', fullPath);
      await this.FileRepository.create({
        name: folderName,
        type: 'folder',
        internalPath: `${internalPath}${folderName}`,
        parentId: parentId,
        path: fullPath,
        info: {},
        userId: _id,
        isActive: true
      });
      return res.status(HttpStatus.Created).json({ message: 'created successfully', output: true });
    } catch (error) {
      return res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }

  async upload (req, res) {
    // user inputs 
    const user = req.user;
    const files = req.files;
    const parentId = req.body.parentId || '';
    // Upload variables
    const successFiles = [];
    const errorFiles = [];
    let internalPath = `${uploadPath}${user._id}/`;
    const fullPath = localPath.join(__dirname, `${uploadPath}${internalPath}`);
    if (parentId) {
      const folder = await this.FileRepository.getById(parentId);

      if (!folder) {
        return res.status(HttpStatus.BadRequest).json({
          message: 'Folder Parent Not Found',
          output: false
        });
      }
      console.log('folder', folder);
      internalPath = `${folder.internalPath}/`;
      console.log('internalPath', internalPath);
    }

    try {
      const createDir = await mkdir(fullPath, { recursive: true });
      console.log('[folderCreated]', fullPath);
    } catch (error) {
      return res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }

    for (const i in files) {
      const file = files[i];
      const name = uuid.v4() + localPath.extname(file.originalFilename);
      const tempPath = file.path;
      const targetPath = localPath.join(__dirname, `${internalPath}${name}`);
      console.log('targetPath', targetPath);
      try {
        const result = await rename(tempPath, targetPath);
        successFiles.push({
          name: name,
          type: 'file',
          internalPath: internalPath,
          parentId: parentId,
          path: targetPath,
          info: file,
          userId: user._id,
          isActive: true
        });
        console.log('targetPath', targetPath, result);
      } catch (error) {
        console.log(error);
        errorFiles.push({
          name: file.originalFilename
        });
      }
    }
    if (successFiles.length) {
      try {
        await this.FileRepository.insertMany(successFiles);
        return res.status(HttpStatus.Created).json({ message: 'uploaded successfully', output: true });
      } catch (error) {
        res.status(HttpStatus.InternalServerError).json({
          message: error.message,
          output: false
        });
      }
    } else {
      res.status(HttpStatus.BadRequest).json({
        message: 'We are not able to upload Files',
        successFiles: successFiles,
        errorFiles: errorFiles,
        output: false
      });
    }
  }
  
  async delete (req, res) {
    // check and create folder
    const { _id } = req.user || {};
    const parentId = req.params.fileId || '';
    let internalPath = '';
    
    if (!parentId) {
      return res.status(HttpStatus.BadRequest).json({
        message: 'File/Folder Not Present',
        output: false
      });
    }

    if (parentId) {
      const folder = await this.FileRepository.getById(parentId);
      if (!folder) {
        return res.status(HttpStatus.BadRequest).json({
          message: 'Folder Parent Not Found',
          output: false
        });
      }
      console.log('Check Parent Path', folder);
      if (folder.type === 'folder') {
        internalPath = `${folder.internalPath}/`;
      } else if (folder.type === 'file') {
        internalPath = `${folder.internalPath}${folder.name}`;
      }
      console.log('internalPath', internalPath);
    }

    try {
      // check folder exist
      const fullPath = localPath.join(__dirname, `${internalPath}`);
      const fileExists = existsSync(fullPath);
      if (!fileExists) {
        return res.status(HttpStatus.BadRequest).json({
          message: 'File/Folder Not Exists',
          output: false
        });
      }
      console.log('fullPath', fullPath);
      rm(fullPath, { recursive: true });
      await this.FileRepository.removeById(parentId);
      return res.status(HttpStatus.Created).json({ message: 'deleted successfully', output: true });
    } catch (error) {
      return res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }

  async version (req, res) {
    try {
      res.status(HttpStatus.Created).json('File version 1');
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({
        message: error.message,
        output: false
      });
    }
  }
}

export default FileController;