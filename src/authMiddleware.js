require('dotenv').config();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="GestaoPadaria"');
    return res.status(401).send('Autenticação requerida');
  }
  const base64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  if (
    user === process.env.PADARIA_USER &&
    pass === process.env.PADARIA_PASS
  ) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="GestaoPadaria"');
  return res.status(401).send('Usuário ou senha inválidos');
}

module.exports = authMiddleware; 