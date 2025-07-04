const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
require('dotenv').config();

const prisma = new PrismaClient();

async function runMigrations() {
  console.log('🚀 Iniciando migrações para Neon.tech...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está configurada!');
    process.exit(1);
  }
  
  try {
    // Verificar conexão antes das migrações
    console.log('🔄 Testando conexão...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão OK');
    
    // Executar migrações
    console.log('🔄 Executando migrações...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: process.env 
    });
    console.log('✅ Migrações executadas com sucesso!');
    
    // Verificar tabelas após migração
    console.log('🔄 Verificando tabelas após migração...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Tabelas encontradas:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Verificar se as tabelas principais foram criadas
    const expectedTables = ['Pao', 'Cliente', 'Encomenda', 'ItemEncomenda'];
    const foundTables = tables.map(t => t.table_name);
    
    let allTablesExist = true;
    for (const table of expectedTables) {
      if (foundTables.includes(table)) {
        console.log(`✅ Tabela ${table} criada com sucesso`);
      } else {
        console.log(`❌ Tabela ${table} NÃO foi criada`);
        allTablesExist = false;
      }
    }
    
    if (allTablesExist) {
      console.log('🎉 Todas as tabelas foram criadas com sucesso!');
      console.log('✅ Migração concluída com sucesso!');
    } else {
      console.log('⚠️  Algumas tabelas não foram criadas. Verifique os logs.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    
    if (error.message.includes('SSL')) {
      console.log('💡 Sugestão: Verifique se a URL inclui sslmode=require');
    }
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Sugestão: Verifique se o banco existe no Neon');
    }
    
    if (error.message.includes('authentication')) {
      console.log('💡 Sugestão: Verifique as credenciais na DATABASE_URL');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão fechada');
  }
}

runMigrations(); 