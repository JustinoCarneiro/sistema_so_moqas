# MoQa — Contrato canônico de trabalho

## Objetivo

MoQa — plataforma de gestão operacional para monitoramento e manutenção de
ativos de qualidade do ar em campo: ordens de serviço, geolocalização de
dispositivos, galeria de fotos e roteamento de campo. Metodologia OndaDev —
versão em `ONDA_VERSION`.

## Mapa do repositório

| Caminho | Finalidade |
| --- | --- |
| `README.md` | Visão geral do produto, design system e stack. |
| `backend/` | Django REST Framework · PostgreSQL · Pillow. `backend/devices/` é o app principal (models, serializers, views, tests). |
| `frontend/` | React 18 + Vite + Tailwind. E2E em `frontend/cypress/`. |
| `docker-compose.yml` | Postgres + serviços de desenvolvimento. |
| `start.sh` | Sobe o ambiente local. |
| `*.csv` (raiz) | Planilhas de acompanhamento e mapeamento de IDs (dado operacional, não segredo). |
| `.agents/rules/fullstack-standards.md` | Padrões React + Django + PostgreSQL do projeto (mantido). |
| `.agents/skills/`, `.claude/skills/` | Skills OndaDev + skills locais (`django-audit`, `react-performance`). Não edite os destinos `ondadev-*` (a fonte é o `onda-starter`). |
| `.ondadev/` | Protocolo de failover de cota e template de handoff entre agentes. |
| `.github/workflows/` | CI de secret scanning (gitleaks nos commits do PR). |

## Autoridade da informação

| Assunto | Fonte canônica | Papel das demais fontes |
| --- | --- | --- |
| Escopo e funcionalidades | `README.md` + histórico Git | GitHub apenas reflete o trabalho. |
| Padrões de código | `.agents/rules/fullstack-standards.md` | — |
| Decisão de arquitetura | Histórico Git / PRs | — |
| Código e histórico versionado | Git | GitHub registra PRs, revisão e CI. |

## Comandos verificados

```bash
# Ambiente local
docker compose up -d
bash start.sh

# Backend (Django)
cd backend && python manage.py migrate
cd backend && python manage.py test        # suíte unit + integração de API

# Frontend (React + Vite)
cd frontend && npm ci
cd frontend && npm run lint
cd frontend && npm run build
cd frontend && npx cypress run             # E2E

# Checkpoint de handoff entre agentes (só metadados seguros)
bash scripts/ai-checkpoint.sh --stdout
```

## Fronteiras e convenções

- **Frontend:** só componentes funcionais + hooks; Tailwind/CSS Modules; Context
  API para estado global simples; lógica complexa em custom hooks
  (`.agents/rules/fullstack-standards.md`).
- **Backend:** DRF com `ViewSets`/`Routers`; PEP 8; type hints em toda assinatura.
- **Geodados:** coordenadas de dispositivos e cálculo de rota (Haversine) são
  núcleo do produto — não quebre sem teste.
- Documentação em português claro; nomes técnicos no idioma da tecnologia.

## Segurança e classes de risco

Dado operacional de campo (localização de ativos, fotos, planilhas). Nunca
versione, exiba em log ou cole em prompt: `SECRET_KEY` do Django, credenciais do
Postgres, tokens de mapa/serviço, `.env` real. `.env` e `.env.*` não são
versionados; `.env.example` só com placeholders.

| Nível | Exemplos | Regra |
| --- | --- | --- |
| R0 | Leitura, docs, testes locais | Executar e validar normalmente. |
| R1 | Código, dependência, migração de schema aditiva, CI, configuração compartilhada | Declarar impacto, testar e pedir revisão de diff. |
| R2 | Produção, migração/backfill de dados, credenciais, deploy, exclusão de OS ou fotos | Exigir autorização explícita e alvo confirmado. |

A fronteira exata das classes de risco segue o `AGENTS.md` do `onda-starter`
(migração de schema/dados e auth são R2).

## Definition of Done

1. atende a um escopo escrito com critérios verificáveis;
2. executa os testes que existem (`manage.py test`, `npm run lint`, Cypress) e
   reporta o resultado;
3. atualiza `README.md` ou `.agents/rules/` quando o padrão mudou;
4. não introduz segredo, credencial ou dado operacional restrito no repositório;
5. passa por revisão proporcional ao risco e deixa um diff compreensível;
6. registra handoff com mudanças, validações, decisões, riscos e pendências.

Não afirme que testes, CI, deploy ou sincronização passaram sem evidência.

## Revisão e handoff entre agentes

Claude e Codex seguem este arquivo como núcleo comum. Um autor por PR; o outro
revisa o diff quando o risco (R1/R2) exige. Quando a cota de um agente acaba, o
outro assume por handoff — protocolo na metodologia OndaDev 3.0 (`ONDA_VERSION`),
com `scripts/ai-checkpoint.sh` preenchendo `.ondadev/handoff/current.md`.

Síntese de handoff:

```text
Escopo: …
Mudanças: …
Validações executadas e resultado: …
Decisões/ADRs: …
Riscos, bloqueios e próximos passos: …
```
