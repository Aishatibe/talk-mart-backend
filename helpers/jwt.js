const expressJwt = require('express-jwt');

function authJwt() {
  const api = process.env.API_URL;
  const secret = process.env.SECRET;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;

/* const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET;
  return jwt({
    secret,
    algorithms: ['HS256'],
  });
}
module.exports = authJwt;
 */
