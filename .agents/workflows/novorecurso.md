---
description: Pergunta o nome da entidade, cria o App no Django (Model, View, Serializer, URL) e os componentes funcionais no React (Lista e Formulário).
---

1. **Interação Inicial:** Pergunte ao usuário qual é o nome do novo recurso/entidade que ele deseja criar (ex: "Cliente", "Produto", "Monitor"). Aguarde a resposta antes de gerar o código.
2. **Backend (Django):**
   - Crie um novo App Django para o recurso.
   - Gere o `models.py` com os campos básicos solicitados.
   - Gere o `serializers.py` utilizando `ModelSerializer`.
   - Gere o `views.py` utilizando `ModelViewSet`.
   - Crie o `urls.py` do App roteando o ViewSet e instrua como incluí-lo no `urls.py` principal.
3. **Frontend (React.js):**
   - Crie uma nova pasta dentro de `src/components/` com o nome do recurso.
   - Gere um componente de Listagem (ex: `MonitorList.jsx`) que faça um GET na API do Django.
   - Gere um componente de Criação/Edição (ex: `MonitorForm.jsx`) que faça POST/PUT na API.
   - Utilize Tailwind CSS para um design limpo e responsivo.
4. **Finalização:** Adicione comentários explicativos curtos no código e valide se as regras globais do projeto (rules) foram respeitadas (ex: sem componentes de classe, sem PO UI, seguindo PEP 8).