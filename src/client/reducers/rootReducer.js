import { combineReducers } from 'redux';
import UserReducer from './user';
import FilesReducer from './files';

export default combineReducers({
  files: FilesReducer,
  users: UserReducer
});