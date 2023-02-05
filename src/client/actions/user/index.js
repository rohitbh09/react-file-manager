/* eslint-disable no-console */
export const fetchUser = () => {
  return {
    type: 'FETCH_USER'
  };
};

export const receiveUser = data => {
  return {
    type: 'FETCHED_USER',
    data: data
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
