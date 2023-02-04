/* eslint-disable no-console */
export const fetch_post = () => {
  return {
    type: 'FETCH_POST'
  };
};

export const receive_post = post => {
  return {
    type: 'FETCHED_POST',
    data: post
  };
};

export const receive_error = () => {
  return {
    type: 'RECEIVE_ERROR'
  };
};

export const fetchUserInfo = username => {
  const user = username.replace(/\s/g, '');
  // eslint-disable-next-line no-console
  console.log('fetchUserInfo start');
  return function (dispatch, getState) {
    console.log('fetchUserInfo start 2');
    dispatch(fetch_post());
    console.log('fetchUserInfo start 3');
    return fetch(`https://api.github.com/users/${user}`)
      .then(data => data.json())
      .then(data => {
        console.log('fetchUserInfo start 4');
        if (data.message === 'Not Found') {
          throw new Error('No such post found!!');
        } else dispatch(receive_post(data));
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('fetchUserInfo', err);
      });
  };
};