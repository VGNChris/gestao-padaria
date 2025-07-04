#!/bin/bash

# Script de build específico para o Render.com
echo "🚀 Iniciando build no Render.com..."

# Verificar se estamos usando NPM
if [ -f "package-lock.json" ]; then
    echo "✅ Package-lock.json encontrado - usando NPM"
else
    echo "❌ Package-lock.json não encontrado"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npm run build

# Executar migrações
echo "🗄️ Executando migrações..."
npm run db:migrate:safe

echo "✅ Build concluído com sucesso!" 