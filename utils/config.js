const JWT = 'dev-secret';
const { MONGO = 'mongodb://localhost:27017/moviesdb' } = process.env;

module.exports = {
  JWT,
  MONGO,
};
