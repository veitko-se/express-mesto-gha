const {
  NODE_ENV = 'development',
  JWT_SECRET = 'dev-secret',
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb',
  HTTP_PORT = 3000,
} = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  DB_URL,
  HTTP_PORT,
};
