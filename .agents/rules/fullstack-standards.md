---
trigger: always_on
---

# Padrões Globais de Desenvolvimento: React.js + Django + PostgreSQL

## 1. Frontend (React.js)
* **Arquitetura de Componentes:** Utilize exclusivamente Componentes Funcionais (Functional Components) e React Hooks (useState, useEffect, useContext, etc.). Não utilize Class Components.
* **Bibliotecas de UI:** Desenvolva componentes de interface customizados utilizando Tailwind CSS ou CSS Modules.
* **Gerenciamento de Estado:** Prefira a Context API nativa do React para estados globais simples. 
* **Boas Práticas:** Extraia lógicas complexas para Custom Hooks visando a reutilização de código e mantenha os arquivos de componentes com responsabilidade única.

## 2. Backend (Django & Python)
* **Estrutura de API:** Utilize o Django REST Framework (DRF) para todas as rotas de API. Crie rotas padronizadas utilizando `ViewSets` e `Routers` sempre que apropriado.
* **Estilo de Código:** Siga rigorosamente a PEP 8. Utilize Type Hints nativos do Python em todas as assinaturas de funções e métodos.
* **Regra de Negócio:** Aplique o padrão "Fat Models, Thin Views". A lógica de negócio deve residir primordialmente nos Models ou em arquivos `services.py`, mantendo as Views apenas com a responsabilidade de orquestrar a requisição HTTP.

## 3. Banco de Dados (PostgreSQL & ORM)
* **Performance de Queries:** Sempre avalie o uso de `select_related()` e `prefetch_related()` nas queries do Django ORM para evitar o problema de N+1 consultas no PostgreSQL.
* **Segurança e Validação:** Toda entrada de dados via API deve ser estritamente validada através de `Serializers` do DRF antes de tocar no banco de dados.

## 4. Comportamento Geral do Agente
* Antes de escrever qualquer código estrutural, analise como ele se conecta entre o Django e o React.
* Mantenha os nomes de variáveis e funções em inglês (ex: `get_devices()`), mas o conteúdo focado no usuário final (textos de interface) em português do Brasil.