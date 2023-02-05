/* eslint-disable no-console */
export const fetchUser = () => {
  return {
    type: 'FETCH_USER'
  };
};

export const receiveUser = post => {
  return {
    type: 'FETCHED_USER',
    data: post
  };
};

export const receiveError = () => {
  return {
    type: 'RECEIVE_ERROR'
  };
};

export const loginUser = (userName, password) => {
  const user = userName.replace(/\s/g, '');
  return function (dispatch, getState) {
    dispatch(fetchUser());
    return fetch('/api/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: userName,
        password: password
      })
    })
      .then(data => data.json())
      .then(data => {
        if (data.output) {
          try {
            localStorage.setItem('token', data.data.token);
          } catch (error) {
            console.error('Set Local Store ERROR', error);
          }
          dispatch(receiveUser(data.data));
        } else {
          throw new Error('No such user found!!');
        }
      })
      .catch((err) => {
        dispatch(receiveError())
      });
  };
};

export const fetchUserInfo = (userName, password) => {
  const user = userName.replace(/\s/g, '');
  return function (dispatch, getState) {
    dispatch(fetchUser());
    return fetch('/user/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: userName,
        password: password
      })
    })
      .then(data => data.json())
      .then(data => {
        if (data.message === 'Not Found') {
          throw new Error('No such user found!!');
        } else dispatch(receiveUser(data));
      })
      .catch(err => dispatch(receiveError()));
  };
};