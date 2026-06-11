#!/bin/bash

# Script de inicialização do sistema MoQa

echo "🚀 Iniciando o sistema MoQa..."
echo "Subindo backend, frontend e banco de dados via Docker..."

docker compose up --build
