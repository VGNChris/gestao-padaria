require('dotenv').config();

function authMiddleware(req, res, next) {
  try {
    console.log('🔐 Verificando autenticação para:', req.method, req.path);
    
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
      console.log('❌ Autenticação não fornecida');
      res.set('WWW-Authenticate', 'Basic realm="GestaoPadaria"');
      return res.status(401).json({ 
        error: 'Autenticação requerida',
        message: 'Credenciais não fornecidas'
      });
    }
    
    const base64 = auth.split(' ')[1];
    const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
    
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.PADARIA_USER || !process.env.PADARIA_PASS) {
      console.error('❌ Variáveis de autenticação não configuradas');
      return res.status(500).json({ 
        error: 'Configuração de autenticação incompleta',
        message: 'PADARIA_USER e PADARIA_PASS devem estar configuradas'
      });
    }
    
    if (user === process.env.PADARIA_USER && pass === process.env.PADARIA_PASS) {
      console.log('✅ Autenticação bem-sucedida para usuário:', user);
      return next();
    }
    
    console.log('❌ Credenciais inválidas para usuário:', user);
    res.set('WWW-Authenticate', 'Basic realm="GestaoPadaria"');
    return res.status(401).json({ 
      error: 'Usuário ou senha inválidos',
      message: 'Credenciais incorretas'
    });
  } catch (error) {
    console.error('❌ Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro interno na autenticação',
      message: error.message
    });
  }
}

module.exports = authMiddleware; 