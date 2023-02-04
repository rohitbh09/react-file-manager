import { Schema } from 'mongoose';

const FileSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 512
  },
  type: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  internalPath: {
    type: String,
    required: true
  },
  parentId: {
    type: String
  },
  info: {
    type: Object
  },
  userId: {
    type: String,
    required: true,
    maxLength: 50
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

export default FileSchema;
