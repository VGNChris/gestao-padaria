const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testDateFilter() {
  console.log('🔍 Testando filtro de data de entrega...');
  
  try {
    // Buscar todas as encomendas para ver as datas
    console.log('📋 Todas as encomendas:');
    const todasEncomendas = await prisma.encomenda.findMany({
      include: { cliente: true },
      orderBy: { dataEntrega: 'desc' }
    });
    
    todasEncomendas.forEach(enc => {
      console.log(`  - ID: ${enc.id}, Cliente: ${enc.cliente.nome}, Data Entrega: ${enc.dataEntrega.toISOString().slice(0,10)}`);
    });
    
    // Testar filtro para hoje
    const hoje = new Date();
    const hojeStr = hoje.toISOString().slice(0,10);
    console.log(`\n📅 Testando filtro para hoje (${hojeStr}):`);
    
    const dataInicio = new Date(hojeStr);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(hojeStr);
    dataFim.setHours(23, 59, 59, 999);
    
    const encomendasHoje = await prisma.encomenda.findMany({
      where: {
        dataEntrega: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: { cliente: true }
    });
    
    console.log(`✅ Encomendas para hoje: ${encomendasHoje.length}`);
    encomendasHoje.forEach(enc => {
      console.log(`  - ID: ${enc.id}, Cliente: ${enc.cliente.nome}, Data Entrega: ${enc.dataEntrega.toISOString()}`);
    });
    
    // Testar filtro para amanhã
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const amanhaStr = amanha.toISOString().slice(0,10);
    console.log(`\n📅 Testando filtro para amanhã (${amanhaStr}):`);
    
    const amanhaInicio = new Date(amanhaStr);
    amanhaInicio.setHours(0, 0, 0, 0);
    const amanhaFim = new Date(amanhaStr);
    amanhaFim.setHours(23, 59, 59, 999);
    
    const encomendasAmanha = await prisma.encomenda.findMany({
      where: {
        dataEntrega: {
          gte: amanhaInicio,
          lte: amanhaFim
        }
      },
      include: { cliente: true }
    });
    
    console.log(`✅ Encomendas para amanhã: ${encomendasAmanha.length}`);
    encomendasAmanha.forEach(enc => {
      console.log(`  - ID: ${enc.id}, Cliente: ${enc.cliente.nome}, Data Entrega: ${enc.dataEntrega.toISOString()}`);
    });
    
    console.log('\n🎉 Teste de filtro de data concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDateFilter(); 