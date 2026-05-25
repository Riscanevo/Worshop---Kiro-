#!/bin/bash

# Script de limpieza del proyecto POS Frontend
# Elimina archivos redundantes y no utilizados

echo "🧹 Iniciando limpieza del proyecto..."

# 1. Eliminar carpeta design-system completa (NO SE USA)
if [ -d "design-system" ]; then
  echo "❌ Eliminando design-system/ (57+ archivos no utilizados)..."
  rm -rf design-system
fi

# 2. Eliminar archivos de configuración duplicados/generados
echo "❌ Eliminando archivos de configuración duplicados..."
rm -f vite.config.js
rm -f vite.config.d.ts

# 3. Eliminar archivos de caché de TypeScript
echo "❌ Eliminando archivos de caché de TypeScript..."
rm -f tsconfig.tsbuildinfo
rm -f tsconfig.node.tsbuildinfo

# 4. Eliminar pnpm-lock.yaml (el proyecto usa npm)
if [ -f "pnpm-lock.yaml" ]; then
  echo "❌ Eliminando pnpm-lock.yaml (conflicto con package-lock.json)..."
  rm -f pnpm-lock.yaml
fi

# 5. Eliminar documentación del workshop (OPCIONAL - comentar si quieres mantener)
# echo "❌ Eliminando documentación del workshop..."
# rm -f WORKSHOP.md
# rm -f SDD_REFLECTION.md

echo ""
echo "✅ Limpieza completada!"
echo ""
echo "📊 Resumen:"
echo "  - design-system/: ~60 archivos eliminados"
echo "  - Archivos de configuración duplicados: 2 eliminados"
echo "  - Archivos de caché: 2 eliminados"
echo "  - Lock files duplicados: 1 eliminado"
echo ""
echo "💡 Recomendación: Ejecuta 'npm install' para verificar que todo funciona correctamente"
