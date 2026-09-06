@AGENTS.md

# MoQa — Sistema de Manutenção de Monitores

Plataforma de gestão operacional de monitoramento da qualidade do ar. O contrato
canônico de trabalho está em `AGENTS.md`; não o duplique aqui.

## Contexto rápido

- **Stack:** Django REST Framework + PostgreSQL (backend), React 18 + Vite +
  Tailwind (frontend), Cypress (E2E), Docker Compose.
- **App principal:** `backend/devices/` (models, serializers, views, tests).
- **Padrões:** `.agents/rules/fullstack-standards.md`.
- **Validar:** `cd backend && python manage.py test` · `cd frontend && npm run
  lint && npm run build` · `npx cypress run`.

## Preferências pessoais

Use `CLAUDE.local.md` (não versionado, sem segredos) para preferências locais.
