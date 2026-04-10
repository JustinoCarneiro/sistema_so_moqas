# 🏙️ MoQa - Sistema de Manutenção de Monitores

O **MoQa** é uma plataforma de gestão operacional para o monitoramento e manutenção de ativos em campo. O sistema foi desenvolvido com uma arquitetura robusta e uma interface focada na experiência do usuário, permitindo o controle completo de ordens de serviço e geolocalização de dispositivos.

---

## 💎 Design System & UX
O sistema utiliza um design premium com as seguintes características:
- **Glassmorphism**: Interface translúcida com efeitos de desfoque de fundo (Blur).
- **Sidebar Retrátil**: Menu inteligente que maximiza o espaço de trabalho.
- **Animações Fluídas**: Transições de abas via `Framer Motion`.
- **Micro-interações**: Feedbacks visuais em tempo real para ações do usuário.

---

## 🚀 Funcionalidades Principais
1.  **Dashboard de Performance**: Indicadores de monitores totais, serviços ativos e progresso de manutenções.
2.  **Monitoramento Geográfico**: Registro completo de monitores com coordenadas de latitude/longitude e integração visual.
3.  **Gestão Especializada**: Sistema de ordens de serviço (OS) com controle de status e **Histórico de Evolução (Timeline)** para acompanhamento de campo (MoQa a MoQa).
4.  **Galeria de Fotos**: Upload de fotos para registro visual das manutenções realizadas.
5.  **Exportação PDF**: Geração de relatórios profissionais com filtros por período de data.

---

## 🛠️ Stack Tecnológica

### Backend (Django REST Framework)
-   **Python 3.12** + **Django**: Estrutura robusta para APIs seguras.
-   **PostgreSQL**: Banco de dados relacional (Docker/Docker Compose).
-   **Django Tests**: Suíte de testes unitários e de integração de API.
-   **Pillow**: Processamento de imagens para o sistema de fotos.

### Frontend (React + Vite)
-   **React 18** + **Vite**: Desenvolvimento veloz e build otimizado.
-   **Tailwind CSS**: Estilização moderna e responsiva.
-   **Lucide React**: Biblioteca de ícones vetoriais.
-   **Framer Motion**: Animações de interface de alto desempenho.
-   **jsPDF**: Geração dinâmica de relatórios PDF.

---

## 🧪 Ecossistema de Testes

O projeto segue padrões de qualidade elevados com três camadas de testes:

1.  **Backend Unit Tests**: Validação de lógica de negócio e integridade do banco (Django).
2.  **Frontend Unit Tests (Vitest)**: Testes de renderização de componentes e lógica de estado.
3.  **E2E Testing (Cypress)**: Testes de ponta-a-ponta que simulam o fluxo real do usuário (Navegação, Criação de Monitores e O.S.).

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
-   Docker e Docker Compose
-   Node.js 18+
-   Python 3.12+ (opcional se não usar Docker)

### 🐍 Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### ⚛️ Frontend
```bash
cd frontend
npm install
npm run dev
```

### 🧪 Executar Testes
```bash
# Backend
python manage.py test

# Frontend Unit
cd frontend && npm run test

# Frontend E2E (Cypress)
cd frontend && npm run test:e2e
```

---

*Desenvolvido com excelência para a gestão de serviços críticos.*
