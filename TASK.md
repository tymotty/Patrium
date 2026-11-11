# Patrium: Tarefas, Bugs e Decisões

Documento vivo do projeto. Serve para lembrar **o que foi feito, o que deu errado e por que cada decisão foi tomada**.



## Índice

1. [Visão rápida](#1-visão-rápida)
2. [Tarefas em andamento](#2-tarefas-em-andamento)
3. [Backlog](#3-backlog)
4. [Registro de bugs](#4-registro-de-bugs)
5. [Registro de mudanças e decisões](#5-registro-de-mudanças-e-decisões)
6. [Regras do projeto](#6-regras-do-projeto)
7. [Modelos para copiar](#7-modelos-para-copiar)

---

## 1. Visão rápida

 Item               | Situação  

 Projeto            | Patrium, organização financeira pessoal/familiar (Fase 1, sem dinheiro real) 
 Stack              | HTML + CSS + JS puro (DOM) → SQL depois → React/Node quando aprender 
 Deploy             | GitHub Pages, servindo da raiz 
 Fase atual         | Refazendo a Visão Geral do zero, em missões guiadas 
 Última atualização | 2026-11-10 

---

## 2. Tarefas em andamento

Legenda: `[ ]` a fazer · `[~]` em andamento · `[x]` concluída

### Refazer a Visão Geral (missões)

- [~] **Missão 1:** estrutura de pastas e esqueleto HTML
  - [x] `index.html` na raiz, com `css/` e `js/`
  - [x] Cabeçalho (`<header>`) com `<h1>`, subtítulo e filtros
  - [x] `id`s únicos nos botões de filtro; botão de lançamento fechado; olho como `<button>`
  - [ ] Cada KPI como widget próprio, irmão dos demais (sem o grupo `widget-cards`)
  - [ ] Mesma tag para todos os widgets
  - [ ] Nome do KPI do meio conferido com o design (Rentabilidade, não Receita)
  - [ ] `id` + atributo `data-` identificando cada widget
  - [ ] Título em cada widget (visível ou *visually hidden*)
  - [ ] Container único dos widgets sem `<section>` desnecessária
  - [ ] Acessibilidade dos filtros: `data-` do período, grupo com `role`, estado ativo, olho com estado
  - [ ] Validar no W3C e anotar os erros/avisos
- [ ] **Missão 2:** CSS base (variáveis, fonte Inter, layout de duas colunas)
- [ ] **Missão 3:** menu lateral (sidebar)
- [ ] **Missão 4:** dados em JS (`dados.js`, com `localStorage`)
- [ ] **Missão 5:** cards de métrica gerados pelo JS
- [ ] **Missão 6:** gráfico de evolução do patrimônio
- [ ] **Missão 7:** gráfico de alocação, com clique
- [ ] **Missão 8:** Orçamento, Metas e Últimos lançamentos
- [ ] **Missão 9:** interações (ocultar valores, período, `localStorage`)
- [ ] **Missão 10:** responsivo para celular
- [ ] **Missão 11:** revisão de segurança

### Outras tarefas abertas

- [ ] Conectar o modal "Novo Lançamento" ao Orçamento de verdade (hoje o lançamento some ao recarregar)
- [ ] Criar `js/dados.js` compartilhado, com categorias, histórico, subcategorias e configurações
- [ ] Orçamento ouvir o evento `lancamento:salvo` e redesenhar
- [ ] Receita e Investimento precisam de um lugar para guardar os lançamentos
- [ ] Criar `js/configuracoes.js` (a página já chama o arquivo e dá 404)
- [ ] Testar `configuracoes.html` no navegador
- [ ] Testar o modal por completo no celular
- [ ] Conferir se as chaves de `subcategoriasPorCategoria` batem com as `chave` de `categoriasOrcamento`
- [ ] Conferir o formato de data (AAAA-MM-DD no modal × dd/mm/aaaa no histórico)

---

## 3. Backlog

### Ideias de interação

- [ ] Alocação clicável (Visão Geral): clicar numa fatia abre embaixo o gráfico de crescimento de 12 meses da categoria
- [ ] Clicar no card "Patrimônio" leva a Investimentos
- [ ] Investimentos: primeiro gráfico grande de barras empilhadas, com legenda de crescimento
- [ ] Clicar num segmento abre a área do investimento, com crescimento por mês e gráfico de pizza
- [ ] Navegação consistente (clicar num card leva ao detalhe) e trilha de voltar (Investimentos › Ações)
- [ ] Filtro de período global (1M · 3M · 12M · Tudo)
- [ ] Destaque cruzado ao passar o mouse numa categoria
- [ ] Meta com linha de projeção
- [ ] Alertas (categoria do orçamento acima de 80%, classe fora do peso planejado)
- [ ] Comparação da carteira com CDI e IBOVESPA
- [ ] Estados vazio e de erro em todas as telas
- [ ] Acessibilidade nos gráficos (rótulo ou padrão além da cor, teclado)

### Telas e componentes

- [ ] Páginas: Lançamentos, Histórico, Metas, Personalizar, Configurações, Conta
- [ ] Design (Figma) ainda por fazer: Histórico, Metas, Orçamento, Configurações, Conta
- [ ] Mudar o menu do desktop (avatar, grupos, botão de lançamento, recolher)
- [ ] Tirar o título "Visão Geral" do topo
- [ ] Nav com `.active` automático
- [ ] Chart.js nos canvas
- [ ] Modal de histórico de preço em Investimentos (pontos de compra/venda clicáveis)
- [ ] Sub-grupos de Investimento (Categoria › Classe › Ativo real)
- [ ] Seletor visual de ícone para subcategorias
- [ ] Card de Metas (HTML/CSS definido, falta JS e dados)
- [ ] Unificar os botões "Lançamento" e "+ Novo Lançamento"
- [ ] Personalização: layouts prontos, criar, exportar/importar (validar o JSON importado)

---

## 4. Registro de bugs

Mais recentes no topo.

### BUG-007: `Cannot read properties of null (reading 'appendChild')`
- **Onde:** Orçamento rodando na página `index`
- **Causa:** `javaScript.js` carrega em todas as páginas, então o código do Orçamento procurava elementos que só existem em outra página
- **Solução:** todo bloco específico de uma página fica dentro de `if (document.getElementById('...'))`
- **Como evitar:** antes de usar um elemento, checar se ele existe nesta página
- **Status:** resolvido

### BUG-006: Modal aparecendo na lateral, sem estilo
- **Causa:** faltava o CSS base do overlay
- **Solução:** `.modal-overlay` com `position: fixed` e `display: none`; `.aberto` com `display: flex`
- **Status:** resolvido

### BUG-005: Campos do formulário com estilo padrão do navegador
- **Causa:** `input` e `button` não herdam a fonte do resto da página
- **Solução:** `font: inherit` nesses elementos
- **Status:** resolvido

### BUG-004: Overflow horizontal no mobile ao abrir o accordion
- **Solução:** `overflow-x: hidden` e `flex-wrap`
- **Status:** resolvido

### BUG-003: Ícone Lucide inválido
- **Causa:** o nome `t-shirt` não existe
- **Solução:** usar `shirt`
- **Como evitar:** conferir o nome do ícone no site do Lucide
- **Status:** resolvido

### BUG-002: Cards estáticos duplicados junto com os gerados via JS
- **Causa:** o HTML ainda tinha os cards antigos, e o JS adicionava os novos
- **Solução:** remover os cards estáticos e deixar só os gerados
- **Status:** resolvido

### BUG-001: `categoriasOrcamento is not defined`
- **Causa:** o script usava a variável sem ela ter sido declarada
- **Solução:** declarar a variável antes de usar
- **Status:** resolvido

### Em aberto / observações

- **404 do `favicon.svg`:** sem relação com o modal; falta criar o arquivo ou tirar a referência
- **404 do `js/configuracoes.js`:** o HTML chama o arquivo, que ainda não existe

---
