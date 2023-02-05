/* eslint-disable no-console */
export const userProfile = async () => {
  const token = localStorage.getItem('token');
  return await fetch('/api/user/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({})
  });
};