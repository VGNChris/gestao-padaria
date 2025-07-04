const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testando conexão com Neon.tech...');
  console.log('📊 DATABASE_URL configurada:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está configurada!');
    process.exit(1);
  }
  
  // Verificar se é uma URL do Neon
  const isNeonUrl = process.env.DATABASE_URL.includes('neon.tech');
  console.log('🌐 É URL do Neon:', isNeonUrl);
  
  if (isNeonUrl) {
    console.log('✅ URL do Neon detectada');
    console.log('🔒 Verificando parâmetros SSL...');
    
    if (!process.env.DATABASE_URL.includes('sslmode=require')) {
      console.warn('⚠️  URL não contém sslmode=require - pode causar problemas de conexão');
    } else {
      console.log('✅ SSL configurado corretamente');
    }
  }
  
  try {
    // Testar conexão básica
    console.log('🔄 Testando conexão básica...');
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1 as test`;
    const endTime = Date.now();
    console.log(`✅ Conexão básica OK (${endTime - startTime}ms)`);
    
    // Testar se as tabelas existem
    console.log('🔄 Verificando tabelas...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('📋 Tabelas encontradas:', tables.map(t => t.table_name));
    
    // Verificar se as tabelas principais existem
    const expectedTables = ['Pao', 'Cliente', 'Encomenda', 'ItemEncomenda'];
    const foundTables = tables.map(t => t.table_name);
    
    for (const table of expectedTables) {
      if (foundTables.includes(table)) {
        console.log(`✅ Tabela ${table} existe`);
      } else {
        console.log(`❌ Tabela ${table} NÃO encontrada`);
      }
    }
    
    // Testar operações básicas
    console.log('🔄 Testando operações básicas...');
    
    // Contar pães
    const paesCount = await prisma.pao.count();
    console.log(`🍞 Pães no banco: ${paesCount}`);
    
    // Contar clientes
    const clientesCount = await prisma.cliente.count();
    console.log(`👥 Clientes no banco: ${clientesCount}`);
    
    // Contar encomendas
    const encomendasCount = await prisma.encomenda.count();
    console.log(`📦 Encomendas no banco: ${encomendasCount}`);
    
    // Testar inserção temporária (rollback)
    console.log('🔄 Testando inserção temporária...');
    const testPao = await prisma.pao.create({
      data: {
        nome: 'TESTE_TEMPORARIO',
        unidadesPorPacote: 1,
        valorPacote: 1.00,
        ativo: false
      }
    });
    console.log('✅ Inserção temporária OK, ID:', testPao.id);
    
    // Deletar o teste
    await prisma.pao.delete({
      where: { id: testPao.id }
    });
    console.log('✅ Teste removido com sucesso');
    
    // Verificar configurações do banco
    console.log('🔄 Verificando configurações do banco...');
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `;
    console.log('📊 Informações do banco:', dbInfo[0]);
    
    console.log('✅ Todos os testes passaram!');
    console.log('🎉 Conexão com Neon.tech funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // Sugestões específicas para Neon
    if (error.message.includes('SSL')) {
      console.log('💡 Sugestão: Verifique se a URL inclui sslmode=require');
    }
    
    if (error.message.includes('timeout')) {
      console.log('💡 Sugestão: O Neon pode estar com timeout. Verifique a conectividade.');
    }
    
    if (error.message.includes('authentication')) {
      console.log('💡 Sugestão: Verifique as credenciais na DATABASE_URL');
    }
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Sugestão: Execute as migrações: npm run db:migrate');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão fechada');
  }
}

testConnection(); 