#!/bin/bash
# Script para desplegar frontend Next.js en Vercel
# Requiere: vercel CLI instalado y autenticado (vercel login)

set -e

echo "🚀 Desplegando frontend Next.js en Vercel..."

# Verificar que vercel está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no encontrado. Instalar con: npm i -g vercel"
    exit 1
fi

# Desplegar en producción
vercel --prod

echo "✅ Frontend desplegado. Ver dashboard en https://vercel.com"