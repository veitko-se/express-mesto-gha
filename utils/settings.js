// отказаться от process.env
// const { NODE_ENV, JWT_SECRET } = process.env;

// временно хранить ключ в коде
const NODE_ENV = 'production';
const JWT_SECRET = '24d355499cee2c7203c5ad81401b3e2d343787681f50ba808549babfed15985f';

module.exports = {
  NODE_ENV,
  JWT_SECRET,
};
