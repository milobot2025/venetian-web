#!/bin/bash

# Script de despliegue automático para Strapi en Railway
# Este script ejecuta los comandos necesarios para desplegar la aplicación Strapi

echo "🚀 Iniciando despliegue de Strapi en Railway..."

# 1) Navegar a la carpeta strapi
echo "📁 Cambiando al directorio strapi..."
cd "$(dirname "$0")" || exit 1

# 2) Enlazar con el proyecto de Railway
echo "🔗 Enlazando con proyecto Railway..."
railway link --project 01b134d3-23d9-46dc-b67e-500121772efb

# Verificar si el enlace fue exitoso
if [ $? -ne 0 ]; then
    echo "❌ Error al enlazar con Railway. Verifica que railway CLI esté instalado y autenticado."
    exit 1
fi

# 3) Desplegar la aplicación en Railway
echo "⬆️  Desplegando aplicación en Railway..."
railway up --detach

# Verificar el resultado del despliegue
if [ $? -eq 0 ]; then
    echo "✅ Despliegue iniciado exitosamente. La aplicación se está desplegando en segundo plano."
    echo "📊 Para ver los logs: railway logs"
    echo "🌐 Para abrir la aplicación: railway open"
else
    echo "❌ Error durante el despliegue. Revisa los mensajes de error anteriores."
    exit 1
fi

echo "🎉 Script de despliegue completado."
