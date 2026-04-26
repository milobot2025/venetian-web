#!/bin/bash
# Script para desplegar backend Strapi en Railway
# Requiere: railway CLI instalado y autenticado (railway login)

set -e

echo "🚀 Desplegando backend Strapi en Railway..."

cd ../strapi

# Verificar que railway está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado. Instalar con: npm i -g @railway/cli"
    exit 1
fi

# Desplegar
railway up --service strapi

echo "✅ Backend desplegado. Ver logs con: railway logs"