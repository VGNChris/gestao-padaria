const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testCreateOperations() {
  console.log('🧪 Testando operações de criação...');
  
  try {
    // Teste 1: Criar um pão
    console.log('\n🍞 Teste 1: Criando um pão...');
    const novoPao = await prisma.pao.create({
      data: {
        nome: 'Pão de Teste',
        unidadesPorPacote: 10,
        valorPacote: 5.50,
        ativo: true
      }
    });
    console.log('✅ Pão criado com sucesso:', novoPao);
    
    // Teste 2: Criar um cliente
    console.log('\n👤 Teste 2: Criando um cliente...');
    const novoCliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente de Teste',
        telefone: '11999999999'
      }
    });
    console.log('✅ Cliente criado com sucesso:', novoCliente);
    
    // Teste 3: Criar uma encomenda
    console.log('\n📦 Teste 3: Criando uma encomenda...');
    const novaEncomenda = await prisma.encomenda.create({
      data: {
        clienteId: novoCliente.id,
        dataEntrega: new Date(),
        valorTotal: 11.00,
        statusProducao: 'PENDENTE',
        statusPagamento: 'PENDENTE',
        itensEncomenda: {
          create: [{
            paoId: novoPao.id,
            quantidadePacotes: 2
          }]
        }
      },
      include: {
        cliente: true,
        itensEncomenda: {
          include: {
            pao: true
          }
        }
      }
    });
    console.log('✅ Encomenda criada com sucesso:', novaEncomenda);
    
    // Teste 4: Atualizar o pão
    console.log('\n✏️ Teste 4: Atualizando o pão...');
    const paoAtualizado = await prisma.pao.update({
      where: { id: novoPao.id },
      data: {
        nome: 'Pão de Teste Atualizado',
        valorPacote: 6.00
      }
    });
    console.log('✅ Pão atualizado com sucesso:', paoAtualizado);
    
    // Teste 5: Alterar status do pão
    console.log('\n🔄 Teste 5: Alterando status do pão...');
    const paoStatusAlterado = await prisma.pao.update({
      where: { id: novoPao.id },
      data: {
        ativo: false
      }
    });
    console.log('✅ Status do pão alterado com sucesso:', paoStatusAlterado);
    
    // Limpeza: Deletar os dados de teste
    console.log('\n🧹 Limpando dados de teste...');
    await prisma.itemEncomenda.deleteMany({
      where: { encomendaId: novaEncomenda.id }
    });
    await prisma.encomenda.delete({
      where: { id: novaEncomenda.id }
    });
    await prisma.cliente.delete({
      where: { id: novoCliente.id }
    });
    await prisma.pao.delete({
      where: { id: novoPao.id }
    });
    console.log('✅ Dados de teste removidos com sucesso');
    
    console.log('\n🎉 Todos os testes de criação passaram!');
    
  } catch (error) {
    console.error('❌ Erro nos testes de criação:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // Sugestões específicas
    if (error.message.includes('Unique constraint')) {
      console.log('💡 Sugestão: Verifique se já existe um registro com os mesmos dados');
    }
    
    if (error.message.includes('Foreign key constraint')) {
      console.log('💡 Sugestão: Verifique se as referências (IDs) existem');
    }
    
    if (error.message.includes('Invalid value')) {
      console.log('💡 Sugestão: Verifique se os tipos de dados estão corretos');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão fechada');
  }
}

testCreateOperations(); 