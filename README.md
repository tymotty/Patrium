# Patrium

Plataforma de organização financeira pessoal e familiar, com **personalização livre pelo usuário**: cada pessoa escolhe quais widgets ver, onde ficam e como se parecem.

> **Status:** em desenvolvimento (Fase 1, sem dinheiro real). A Visão Geral está sendo refeita do zero, em missões guiadas. Veja o andamento em [TASK.md](TASK.md).

**Demo:** _([Patrium](https://tymotty.github.io/Patrium/))_

<!-- print da Visão Geral-->

## O que o Patrium faz

- **Visão Geral:** indicadores (patrimônio, rentabilidade), evolução do patrimônio e alocação por categoria
- **Orçamento:** gasto por categoria calculado a partir do histórico de lançamentos
- **Investimentos:** carteira por categoria, classe e ativo
- **Metas** e **Lançamentos:** acompanhamento de objetivos e registro de receitas, despesas e investimentos
- **Personalização:** widgets que podem ser movidos, ocultados e duplicados

## Tecnologias

- HTML, CSS e JavaScript puro (manipulação direta do DOM)
- Fonte Inter hospedada localmente (sem CDN)
- Deploy no GitHub Pages
- Planejado: SQL para persistência e, depois, React/Node

## Estrutura

```
index.html            Visão Geral
investimentos.html    Investimentos
orcamento.html        Orçamento
metas.html            Metas
conta.html            Conta
configuracoes.html    Configurações
css/                  Estilos e fontes
js/                   Scripts
TASK.md               Tarefas, bugs e decisões do projeto
```

## Decisões de segurança

O projeto também é meu campo de prática para segurança de aplicações (AppSec):

- Texto digitado pelo usuário é inserido com `textContent`, nunca com `innerHTML`, para evitar XSS
- JSON importado na personalização é validado (tipos de widget, cores e tamanhos) antes de ser aplicado
- Fontes e recursos locais, sem dependência de terceiros desnecessária, por privacidade
- Revisão de segurança como etapa própria do roadmap

## Como rodar localmente

O projeto usa `fetch` para carregar partes da página, então precisa de um servidor local (abrir o arquivo direto no navegador não funciona).

```bash
# na pasta do projeto
python -m http.server 8000
```

Depois acesse `http://localhost:8000`. No VS Code, a extensão Live Server também funciona.

## Roadmap

Resumo das missões da Visão Geral (detalhes no [TASK.md](TASK.md)):

- [x] Estrutura de pastas e esqueleto HTML
- [ ] CSS base, menu lateral e dados em JS
- [ ] Cards de métrica e gráficos (evolução e alocação)
- [ ] Orçamento, Metas e Últimos lançamentos
- [ ] Interações, responsivo para celular e revisão de segurança

## Autor

**Timóteo** · [GitHub](https://github.com/tymotty) · [LinkedIn](https://www.linkedin.com/in/timoteo-dos-reis-nogueira-a925913aa/)

Estudante de Engenharia de Software, programando em HTML, CSS, JS e SQL e em transição para cibersegurança (AppSec/DevSecOps).