/* eslint-disable no-console */
import mongoose from 'mongoose';

export default function (dbConfig) {
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);
  return new Promise((resolve, reject) => {
    const connection = mongoose.createConnection();
    connection.openUri(dbConfig.connection,
      (err) => {
        if (err) {
          console.error('Failed to connect to mongo on startup', err);
          reject(err);
        } else {
          resolve(connection);
        }
      });
  });
}