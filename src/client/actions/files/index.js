/* eslint-disable no-console */

export const fetchFile = () => {
  return {
    type: 'FETCH_FILE'
  };
};

export const receiveFiles = list => {
  return {
    type: 'RECEIVE_FILES',
    data: list
  };
};

export const receiveError = (message) => {
  return {
    type: 'RECEIVE_FILE_ERROR',
    message
  };
};

export const fileSelected = (fileId) => {
  return {
    type: 'FILE_SELECTED',
    fileId
  };
};
export const currentFolder = (fileId) => {
  return {
    type: 'CURRENT_FOLDER',
    fileId
  };
};
export const breadcrumSelected = (list) => {
  return {
    type: 'BREADCRUM_SELECTED',
    list
  };
};

export const currentFolderId = ({ fileId }) => {
  return function (dispatch, getState) {
    dispatch(currentFolder(fileId));
  };
};
export const fileIdUpdate = ({ fileId }) => {
  return function (dispatch, getState) {
    dispatch(fileSelected(fileId));
  };
};

export const updateBreadCrum = ({ list }) => {
  return function (dispatch, getState) {
    dispatch(breadcrumSelected(list));
  };
};

export const deleteFile = ({ fileId, parentId }) => {
  const token = localStorage.getItem('token');
  return function (dispatch, getState) {
    dispatch(fetchFile());
    return fetch(`/api/file/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `JWT ${token}`
      }
    })
      .then(data => {
        // console.log("data",data);
        if (data.status === 401) {
          try {
            localStorage.removeItem('token');
          } catch (error) {
            console.log('[Unauthorized] Token Remove error');
          }
          window.location.reload(true);
        }
        return data.json();
      })
      .then(data => {
        dispatch(fetchFileList({
          parentId: parentId
        }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(receiveError('File Found Errror'));
      });
  };
};

export const fetchFileList = ({ parentId, key, skip, limit }) => {
  // get parameters
  const params = {
    parentId: parentId || '',
    key: key || 'type',
    skip: skip || 0,
    limit: limit || 20
  };
  // convert to query append 
  const query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  const token = localStorage.getItem('token');
  return function (dispatch, getState) {
    dispatch(fetchFile());
    return fetch(`/api/file?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${token}`
      }
    })
      .then(data => {
        // console.log("data",data);
        if (data.status === 401) {
          try {
            localStorage.removeItem('token');
          } catch (error) {
            console.log('[Unauthorized] Token Remove error');
          }
          window.location.reload(true);
        }
        return data.json();
      })
      .then(data => {
        if( data && data.list){
          dispatch(receiveFiles(data.list));
        } else {
          dispatch(receiveFiles([]));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(receiveError('File Found Errror'))
      });
  };
};