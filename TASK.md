# Patrium: Tarefas, Bugs e Decisões

Documento vivo do projeto. Serve para lembrar **o que foi feito, o que deu errado e por que cada decisão foi tomada**.

## Índice

1. [Visão rápida](#1-visão-rápida)
2. [Tarefas em andamento](#2-tarefas-em-andamento)
3. [Pendências técnicas](#3-pendências-técnicas)
4. [Backlog](#4-backlog)
5. [Registro de bugs](#5-registro-de-bugs)
6. [Registro de mudanças e decisões](#6-registro-de-mudanças-e-decisões)
7. [Regras do projeto](#7-regras-do-projeto)
8. [Modelos para copiar](#8-modelos-para-copiar)

---

## 1. Visão rápida

| Item               | Situação                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| Projeto            | Patrium, organização financeira pessoal/familiar (Fase 1, sem dinheiro real) |
| Stack              | HTML + CSS + JS puro (DOM) → SQL depois → React/Node quando aprender      |
| Deploy             | GitHub Pages, servindo da raiz                                            |
| Fase atual         | Refazendo a Visão Geral do zero, em missões guiadas                       |
| Missão atual       | Missão 2: CSS base                                                        |
| Última atualização | 2026-11-24                                                                |

---

## 2. Tarefas em andamento

Legenda: `[ ]` a fazer · `[~]` em andamento · `[x]` concluída

### Refazer a Visão Geral (missões)

| #  | Missão                                                           | Status |
| -- | ---------------------------------------------------------------- | :----: |
| 1  | Estrutura de pastas e esqueleto HTML                             | `[x]`  |
| 2  | CSS base (variáveis, fonte Inter, layout de duas colunas)        | `[~]`  |
| 3  | Menu lateral (sidebar)                                           | `[ ]`  |
| 4  | Dados em JS (`dados.js`, com `localStorage`)                     | `[ ]`  |
| 5  | Cards de métrica gerados pelo JS                                 | `[ ]`  |
| 6  | Gráfico de evolução do patrimônio                                | `[ ]`  |
| 7  | Gráfico de alocação, com clique                                  | `[ ]`  |
| 8  | Orçamento, Metas e Últimos lançamentos                           | `[ ]`  |
| 9  | Interações (ocultar valores, período, `localStorage`)            | `[ ]`  |
| 10 | Responsivo para celular                                          | `[ ]`  |
| 11 | Revisão de segurança                                             | `[ ]`  |

<details>
<summary>Missão 1 concluída: checklist do que foi feito</summary>

- [x] `index.html` na raiz, com `css/` e `js/`
- [x] Cabeçalho (`<header>`) com `<h1>`, subtítulo e filtros
- [x] `id`s únicos nos botões de filtro; botão de lançamento fechado; olho como `<button>`
- [x] Cada KPI como widget próprio, irmão dos demais (sem o grupo `widget-cards`)
- [x] Mesma tag para todos os widgets
- [x] Nome do KPI do meio conferido com o design (Rentabilidade, não Receita)
- [x] `id` + atributo `data-` identificando cada widget
- [x] Título em cada widget (visível ou *visually hidden*)
- [x] Container único dos widgets sem `<section>` desnecessária
- [x] Acessibilidade dos filtros: `data-` do período, grupo com `role`, estado ativo, olho com estado
- [x] Validar no W3C e anotar os erros/avisos

</details>

---

## 3. Pendências técnicas

Tarefas soltas que não fazem parte das missões, agrupadas por assunto.

### Modal "Novo Lançamento" e Orçamento

- [ ] Conectar o modal ao Orçamento de verdade (hoje o lançamento some ao recarregar)
- [ ] Orçamento ouvir o evento `lancamento:salvo` e redesenhar
- [ ] Receita e Investimento precisam de um lugar para guardar os lançamentos
- [ ] Testar o modal por completo no celular

### Dados

- [ ] Criar `js/dados.js` compartilhado, com categorias, histórico, subcategorias e configurações
- [ ] Conferir se as chaves de `subcategoriasPorCategoria` batem com as `chave` de `categoriasOrcamento`
- [ ] Conferir o formato de data (AAAA-MM-DD no modal × dd/mm/aaaa no histórico)

### Configurações

- [ ] Criar `js/configuracoes.js` (a página já chama o arquivo e dá 404)
- [ ] Testar `configuracoes.html` no navegador

---

## 4. Backlog

### Visão Geral

- [ ] Alocação clicável: clicar numa fatia abre embaixo o gráfico de crescimento de 12 meses da categoria
- [ ] Clicar no card "Patrimônio" leva a Investimentos
- [ ] Filtro de período global (1M · 3M · 12M · Tudo)
- [ ] Destaque cruzado ao passar o mouse numa categoria
- [ ] Meta com linha de projeção
- [ ] Comparação da carteira com CDI e IBOVESPA
- [ ] Card de Metas (HTML/CSS definido, falta JS e dados)
- [ ] Tirar o título "Visão Geral" do topo
- [ ] Chart.js nos canvas

### Investimentos

- [ ] Primeiro gráfico grande de barras empilhadas, com legenda de crescimento
- [ ] Clicar num segmento abre a área do investimento, com crescimento por mês e gráfico de pizza
- [ ] Modal de histórico de preço (pontos de compra/venda clicáveis)
- [ ] Sub-grupos de Investimento (Categoria › Classe › Ativo real)

### Navegação e menu

- [ ] Navegação consistente (clicar num card leva ao detalhe) e trilha de voltar (Investimentos › Ações)
- [ ] Mudar o menu do desktop (avatar, grupos, botão de lançamento, recolher)
- [ ] Nav com `.active` automático
- [ ] Unificar os botões "Lançamento" e "+ Novo Lançamento"

### Novas páginas e design

- [ ] Páginas: Lançamentos, Histórico, Metas, Personalizar, Configurações, Conta
- [ ] Design (Figma) ainda por fazer: Histórico, Metas, Orçamento, Configurações, Conta
- [ ] Seletor visual de ícone para subcategorias

### Personalização

- [ ] Layouts prontos, criar, exportar/importar (validar o JSON importado)

### Qualidade

- [ ] Alertas (categoria do orçamento acima de 80%, classe fora do peso planejado)
- [ ] Estados vazio e de erro em todas as telas
- [ ] Acessibilidade nos gráficos (rótulo ou padrão além da cor, teclado)

---

## 5. Registro de bugs

### Em aberto

- **404 do `favicon.svg`:** sem relação com o modal; falta criar o arquivo ou tirar a referência
- **404 do `js/configuracoes.js`:** o HTML chama o arquivo, que ainda não existe (ver [Pendências técnicas](#3-pendências-técnicas))

### Resolvidos

Mais recentes no topo.

| Bug     | Resumo                                          | Status    |
| ------- | ----------------------------------------------- | --------- |
| BUG-007 | `Cannot read properties of null (appendChild)`  | resolvido |
| BUG-006 | Modal aparecendo na lateral, sem estilo         | resolvido |
| BUG-005 | Campos do formulário com estilo padrão          | resolvido |
| BUG-004 | Overflow horizontal no mobile (accordion)       | resolvido |
| BUG-003 | Ícone Lucide inválido                           | resolvido |
| BUG-002 | Cards estáticos duplicados com os gerados no JS | resolvido |
| BUG-001 | `categoriasOrcamento is not defined`            | resolvido |

#### BUG-007: `Cannot read properties of null (reading 'appendChild')`
- **Onde:** Orçamento rodando na página `index`
- **Causa:** `javaScript.js` carrega em todas as páginas, então o código do Orçamento procurava elementos que só existem em outra página
- **Solução:** todo bloco específico de uma página fica dentro de `if (document.getElementById('...'))`
- **Como evitar:** antes de usar um elemento, checar se ele existe nesta página
- **Status:** resolvido

#### BUG-006: Modal aparecendo na lateral, sem estilo
- **Causa:** faltava o CSS base do overlay
- **Solução:** `.modal-overlay` com `position: fixed` e `display: none`; `.aberto` com `display: flex`
- **Status:** resolvido

#### BUG-005: Campos do formulário com estilo padrão do navegador
- **Causa:** `input` e `button` não herdam a fonte do resto da página
- **Solução:** `font: inherit` nesses elementos
- **Status:** resolvido

#### BUG-004: Overflow horizontal no mobile ao abrir o accordion
- **Solução:** `overflow-x: hidden` e `flex-wrap`
- **Status:** resolvido

#### BUG-003: Ícone Lucide inválido
- **Causa:** o nome `t-shirt` não existe
- **Solução:** usar `shirt`
- **Como evitar:** conferir o nome do ícone no site do Lucide
- **Status:** resolvido

#### BUG-002: Cards estáticos duplicados junto com os gerados via JS
- **Causa:** o HTML ainda tinha os cards antigos, e o JS adicionava os novos
- **Solução:** remover os cards estáticos e deixar só os gerados
- **Status:** resolvido

#### BUG-001: `categoriasOrcamento is not defined`
- **Causa:** o script usava a variável sem ela ter sido declarada
- **Solução:** declarar a variável antes de usar
- **Status:** resolvido

---

## 6. Registro de mudanças e decisões

Mais recentes no topo.

### 2026-11-13: Inter local e CSS refeito
- **O que mudou:** Inter hospedada em `css/fonts/` (sem CDN); `style.css` novo com paleta por papel; widgets posicionados por `[data-widget]`
- **Motivo:** privacidade, sem dependência de terceiro, e posição que sobrevive à duplicação de widgets

### 2026-11-10: Criado o `task.md`
- **Motivo:** centralizar tarefas, bugs e decisões, para não perder o histórico do projeto

### 2026-11-09: Cada KPI será um widget próprio (sem grupo)
- **O que mudou:** os 3 KPIs saem do grupo `widget-cards` e ficam no mesmo nível dos outros widgets
- **Motivo:** a personalização vai mover e ocultar widgets individualmente; um grupo atrapalha isso. A posição na tela é decidida pelo CSS (grade), não pela árvore do HTML

### 2026-11-09: Recomeçar a Visão Geral e Investimentos em DOM puro
- **O que mudou:** o código antigo foi apagado e a tela será refeita em missões guiadas
- **Motivo:** praticar JS já visando a versão final. React depois, quando o fluxo de estado → renderização estiver claro. DOM também treina `textContent` e XSS, que contam para o objetivo de AppSec

### 2026-11-09: Sem título de página no topo
- **O que mudou:** a Visão Geral e Investimentos não repetem o título; ficam o `<h1>` de boas-vindas (Visão Geral) e a barra de ferramentas
- **Motivo:** a sidebar já indica a página ativa, e a tela ganha altura útil

### 2026-11-08: Novo design (Figma) para desktop, mobile, Personalização e Investimentos
- **Direção:** tema escuro com verde de destaque, Inter em tudo (serifa só no logo), hero com gráfico, faixas no mobile, nav inferior com botão "+" central
- **Motivo:** o layout antigo era um dashboard de desktop empilhado numa coluna, sem hierarquia

### Histórico anterior (resumo)

- **Estrutura achatada na raiz** (`index.html`, `investimentos.html`, `orcamento.html`, `configuracoes.html`, `nav.html` + `css/` e `js/`), com caminhos relativos simples. *Motivo:* GitHub Pages e simplicidade; nunca colocar HTML em profundidades diferentes
- **Nav via `nav.html` + `componentes.js`** injetado em `#nav-placeholder`. *Motivo:* um único menu para todas as páginas (exige servidor local por causa do `fetch`)
- **Gasto de cada categoria calculado somando o histórico** (`calcularGastoCategoria`), nunca um número fixo. *Motivo:* uma única fonte de verdade
- **Barra do Orçamento vermelha quando a categoria estoura.** *Motivo:* alerta visual imediato
- **Modal "Novo Lançamento" sem botão "Continuar":** clicar na opção já avança, e o botão "Salvar" só aparece no final. *Motivo:* menos cliques
- **Fluxos do modal:** despesa = tipo → categoria → subcategoria → detalhes; receita = tipo → detalhes; investimento = tipo → destino → detalhes

---

## 7. Regras do projeto

| Área          | Regra                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------- |
| Segurança     | Nunca usar `innerHTML` com texto digitado pelo usuário; usar `textContent`                  |
| Segurança     | Importação de JSON (personalização): validar tipos de widget, cores e tamanhos antes de aplicar |
| Páginas       | Código específico de uma página fica dentro de `if (document.getElementById('...'))`        |
| Arquivos      | Nomes em minúsculas (no GitHub Pages, maiúsculas e minúsculas importam)                     |
| Caminhos      | Relativos e simples, sem `/` inicial nem `../`                                              |
| Dados         | Nada de número fixo quando dá para calcular a partir do histórico                           |
| `id` e `class`| `id` único na página; para estilo, usar `class`                                             |

---

## 8. Modelos para copiar

### Bug

```
### BUG-XXX: Título curto
- **Onde:** arquivo ou página
- **Sintoma:** o que apareceu (mensagem de erro, comportamento)
- **Causa:** por que aconteceu
- **Solução:** o que foi feito
- **Como evitar:** o que lembrar da próxima vez
- **Status:** aberto | em andamento | resolvido
```

### Mudança ou decisão

```
### AAAA-MM-DD: Título curto
- **O que mudou:**
- **Motivo:**
- **Alternativas consideradas:** (opcional)
- **Impacto:** arquivos ou telas afetadas (opcional)
```

### Tarefa

```
- [ ] Verbo + objetivo (arquivo ou tela)
```