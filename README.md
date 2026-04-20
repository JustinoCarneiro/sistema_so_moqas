# 🏙️ MoQa - Sistema de Manutenção de Monitores

O **MoQa** é uma plataforma de gestão operacional para o monitoramento e manutenção de ativos em campo. O sistema foi desenvolvido com uma arquitetura robusta e uma interface focada na experiência do usuário, permitindo o controle completo de ordens de serviço e geolocalização de dispositivos.

---

## 💎 Design System & UX
O sistema utiliza um design premium com as seguintes características:
- **Glassmorphism**: Interface translúcida com efeitos de desfoque de fundo (Blur).
- **Sidebar Retrátil & Mobile Slide-up**: Menu inteligente que maximiza o espaço no desktop e uma transição exclusiva de **"subida de app"** no mobile, revelando a navegação de forma fluida.
- **Header Mobile**: Cabeçalho dedicado para o modo responsivo, garantindo acesso rápido ao menu e identidade visual.
- **Navegação Tática**: Botão flutuante dinâmico de **"Voltar ao Topo"** no canto inferior direito para otimizar a experiência em listas longas.
- **Animações Fluídas**: Transições de abas e estados via `Framer Motion` com física de mola (spring).
- **Micro-interações**: Feedbacks visuais em tempo real para ações do usuário.

---

## 🚀 Funcionalidades Principais
1.  **Dashboard de Performance**: Indicadores de monitores totais, serviços ativos e progresso de manutenções.
2.  **Monitoramento Geográfico**: Registro completo de monitores com coordenadas de latitude/longitude e integração visual.
3.  **Gestão Especializada**: Sistema de ordens de serviço (OS) com controle de status e **Histórico de Evolução (Timeline)** para acompanhamento de campo (MoQa a MoQa).
4.  **Galeria de Múltiplas Fotos**: Suporte completo ao upload e gerenciamento de múltiplas grades de fotografias integradas a cada ordem de serviço em campo.
5.  **Exportação de Dados (CSV)**: Geração de planilhas nativas para auditoria, integrando de forma autônoma os descritivos de trabalho aos vínculos de localização completa do poste (ID Antigo, Zona, Referência).
6.  **Roteamento Inteligente de Campo**: Mecanismo tático embarcado onde o técnico seleciona aparelhos defeituosos e o sistema capta seu sinal GPS, utilizando matemática de proximidade (Fórmula de Haversine) para tecer a rota geometricamente mais rápida e enviá-la ordenada direto para o aplicativo do Google Maps.

---

## 🛠️ Stack Tecnológica

### Backend (Django REST Framework)
-   **Python 3.12** + **Django**: Estrutura robusta para APIs seguras.
-   **PostgreSQL**: Banco de dados relacional (Docker/Docker Compose).
-   **Django Tests**: Suíte de testes unitários e de integração de API.
-   **Pillow**: Processamento de imagens para o sistema de fotos.

### Frontend (React + Vite)
-   **React 18** + **Vite**: Desenvolvimento veloz e build otimizado.
-   **Tailwind CSS**: Estilização moderna e responsiva com foco em estética premium.
-   **Lucide React**: Biblioteca de ícones vetoriais.
-   **Framer Motion**: Animações de interface de alto desempenho e gestos.

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
-   Python 3.12+

### 🐳 Via Docker (Recomendado)
```bash
docker-compose up --build
```

### 🐍 Manual - Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### ⚛️ Manual - Frontend
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
