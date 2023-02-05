/* eslint-disable no-console */
const initialState = {
  list: [],
  isFetching: false,
  isError: false,
  message: '',
  fileId: '',
  breadcrum: []
};

const file = (state = initialState, action) => {
  switch (action.type) {
  case 'FETCH_FILE':
    return Object.assign({}, state, {
      isFetching: true,
      list: [],
      isError: false,
      message: ''
    });
  case 'RECEIVE_FILES':
    return Object.assign({}, state, {
      list: action.data,
      isFetching: false,
      isError: false,
      message: ''
    });
  case 'RECEIVE_FILE_ERROR':
    return Object.assign({}, state, {
      isError: true,
      isFetching: false,
      message: action.message || ''
    });
  case 'FILE_SELECTED':
    return Object.assign({}, state, {
      fileId: action.fileId || ''
    });
  case 'CURRENT_FOLDER':
    return Object.assign({}, state, {
      parentId: action.fileId || ''
    });
  case 'BREADCRUM_SELECTED':
    return Object.assign({}, state, {
      breadcrum: action.list || []
    });
  default:
    return state;
  }
};

export default file;