import { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 512
  },
  userName: {
    type: String,
    required: true,
    maxLength: 512
  },
  password: {
    type: String,
    required: true,
    maxLength: 512
  },
  salt: {
    type: String,
    required: true,
    maxLength: 5000
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

export default UserSchema;
