

(function () {
    'use strict';

    /* ====================== DADOS ====================== */

    const TIPOS = [
        { chave: 'despesa',      nome: 'Despesa',      desc: 'Compras e gastos do dia a dia', icone: 'receipt-text', cor: 'var(--color-red)'   },
        { chave: 'receita',      nome: 'Receita',      desc: 'Salários e outras entradas',    icone: 'wallet',       cor: 'var(--color-green)' },
        { chave: 'investimento', nome: 'Investimento', desc: 'Aportes na sua carteira',       icone: 'trending-up',  cor: '#5B9CFF'            },
    ];

    const FLUXOS = {
        despesa:      ['tipo', 'categoria', 'subcategoria', 'detalhes'],
        receita:      ['tipo', 'detalhes'],
        investimento: ['tipo', 'destino', 'detalhes'],
    };

    const ROTULOS = {
        tipo: 'Tipo', categoria: 'Categoria', subcategoria: 'Subcategoria',
        destino: 'Destino', detalhes: 'Detalhes',
    };

    const TEXTOS = {
        tipo:         ['Novo lançamento',        'O que você deseja registrar?'],
        categoria:    ['Escolha a categoria',    'Vincule o gasto ao seu orçamento mensal'],
        subcategoria: ['Escolha a subcategoria', 'Deixe seu lançamento mais organizado'],
        destino:      ['Onde você investiu?',    'Escolha o destino do aporte'],
        detalhes:     ['Detalhes do lançamento', 'Revise e complete as informações'],
    };

    const DESTINOS = [
        { chave: 'renda-fixa', nome: 'Renda Fixa',          desc: 'Tesouro, CDB, LCI e LCA',        icone: 'piggy-bank', cor: 'var(--color-gold)',   exemplo: 'Ex: Tesouro Selic 2029'  },
        { chave: 'cdi',        nome: 'CDI',                 desc: 'Investimentos atrelados ao CDI', icone: 'percent',    cor: 'var(--color-green)',  exemplo: 'Ex: CDB 110% do CDI'     },
        { chave: 'acoes',      nome: 'Ações',               desc: 'Ações brasileiras e ETFs',       icone: 'trending-up',cor: '#5B9CFF',             exemplo: 'Ex: PETR4'               },
        { chave: 'fiis',       nome: 'Fundos Imobiliários', desc: 'FIIs e fundos de tijolo/papel',  icone: 'building-2', cor: 'var(--color-purple)', exemplo: 'Ex: HGLG11'              },
        { chave: 'cripto',     nome: 'Criptomoedas',        desc: 'Bitcoin, Ethereum e outras',     icone: 'bitcoin',    cor: '#F7931A',             exemplo: 'Ex: Bitcoin'             },
        { chave: 'exterior',   nome: 'Exterior',            desc: 'Ativos internacionais e dólar',  icone: 'globe',      cor: '#22B8CF',             exemplo: 'Ex: IVV'                 },
        { chave: 'outros',     nome: 'Outros',              desc: 'Qualquer outro investimento',    icone: 'shapes',     cor: '#8B93A7',             exemplo: 'Ex: Nome do investimento'},
    ];

    /* Subcategorias padrão, por CHAVE de categoria (confira se bate com as chaves do seu
       categoriasOrcamento). As que já existem em historicoLancamentos aparecem sozinhas.
       Quando o Orçamento também precisar disso, mova para um js/dados.js compartilhado. */
    const subcategoriasPorCategoria = {
        alimentacao: [
            { chave: 'supermercado', nome: 'Supermercado', icone: 'shopping-basket',  exemplo: 'Ex: Compras do mês'    },
            { chave: 'restaurante',  nome: 'Restaurante',  icone: 'utensils-crossed', exemplo: 'Ex: Almoço de domingo' },
            { chave: 'delivery',     nome: 'Delivery',     icone: 'bike',             exemplo: 'Ex: Pedido de pizza'   },
            { chave: 'padaria',      nome: 'Padaria',      icone: 'croissant',        exemplo: 'Ex: Pão e café'        },
        ],
    };

    /* ====================== ESTADO ====================== */

    let overlay, corpo, stepper, rodape, dica, titulo, subtitulo;
    let iniciado = false;
    let cliqueComecouNoFundo = false;
    let estado = estadoInicial();

    function hoje() {
        // não usar toISOString(): ele devolve a data em UTC e, à noite no Brasil, viraria "amanhã"
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mm}-${dd}`;
    }

    function estadoInicial() {
        return {
            tipo: null, categoria: null, subcategoria: null, destino: null, passo: 0,
            form: { descricao: '', valor: '', data: hoje(), obs: '' },
        };
    }

    const fluxoAtual = () => (estado.tipo ? FLUXOS[estado.tipo] : ['tipo', 'detalhes']);
    const etapaAtual = () => fluxoAtual()[estado.passo];

    /* ====================== HELPERS ====================== */

    // Sempre textContent (nunca innerHTML com texto digitado): evita XSS.
    function el(tag, classe, texto) {
        const e = document.createElement(tag);
        if (classe) e.className = classe;
        if (texto != null) e.textContent = texto;
        return e;
    }

    function icone(nome, classe = 'icone') {
        const i = document.createElement('i');
        i.setAttribute('data-lucide', nome);
        i.className = classe;
        return i;
    }

    // aceita "var(--x)", "#fff" ou apenas "--x"
    function corCss(c) {
        if (!c) return '';
        return c.startsWith('--') ? `var(${c})` : c;
    }

    function brl(n) {
        return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '');
    }

    function slug(texto) {
        return texto.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    function parseValor(txt) {
        const n = Number(String(txt).replace(',', '.'));
        return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
    }

    /* ====================== DADOS DO ORÇAMENTO ====================== */

    const categorias = () => (typeof categoriasOrcamento !== 'undefined' ? categoriasOrcamento : []);
    const historicoDe = (chave) =>
        (typeof historicoLancamentos !== 'undefined' && historicoLancamentos[chave]) || [];

    // mesma conta do calcularGastoCategoria: soma do histórico
    const gastoDe = (cat) => historicoDe(cat.chave).reduce((soma, l) => soma + l.valor, 0);

    function subcategoriasDe(chaveCat) {
        const lista = [...(subcategoriasPorCategoria[chaveCat] || [])];
        historicoDe(chaveCat).forEach((l) => {
            const jaExiste = lista.some((s) => s.nome.toLowerCase() === String(l.subcategoria).toLowerCase());
            if (l.subcategoria && !jaExiste) {
                lista.push({ chave: slug(l.subcategoria), nome: l.subcategoria, icone: l.icone || 'tag' });
            }
        });
        return lista;
    }

    const categoriaEscolhida = () => categorias().find((c) => c.chave === estado.categoria);
    const subEscolhida = () => {
        const cat = categoriaEscolhida();
        return cat && subcategoriasDe(cat.chave).find((s) => s.chave === estado.subcategoria);
    };
    const destinoEscolhido = () => DESTINOS.find((d) => d.chave === estado.destino);

    /* ====================== RENDER ====================== */

    function renderizar() {
        const etapa = etapaAtual();
        const [t, s] = TEXTOS[etapa];
        titulo.textContent = t;
        subtitulo.textContent = s;

        renderStepper();
        corpo.replaceChildren();
        ({
            tipo: renderTipo,
            categoria: renderCategoria,
            subcategoria: renderSubcategoria,
            destino: renderDestino,
            detalhes: renderDetalhes,
        })[etapa]();
        renderRodape(etapa);

        if (window.lucide) window.lucide.createIcons();
        corpo.scrollTop = 0;
        atualizarBotaoSalvar();
        if (etapa === 'detalhes') corpo.querySelector('input')?.focus();
    }

    function renderStepper() {
        stepper.replaceChildren();
        fluxoAtual().forEach((etapa, i) => {
            const li = el('li', 'stepper-item');
            if (i < estado.passo) li.classList.add('concluida');
            if (i === estado.passo) {
                li.classList.add('atual');
                li.setAttribute('aria-current', 'step');
            }
            li.append(
                el('span', 'stepper-bolinha', i < estado.passo ? '✓' : String(i + 1)),
                el('span', 'stepper-nome', ROTULOS[etapa])
            );
            stepper.append(li);
        });
    }

    function card(opc, extra) {
        const b = el('button', 'card-opcao' + (extra ? ' ' + extra : ''));
        b.type = 'button';
        b.dataset.escolha = opc.chave;
        if (opc.cor) b.style.setProperty('--cor-item', corCss(opc.cor));
        if (opc.selecionado) b.classList.add('selecionado');
        b.append(icone(opc.icone), el('span', 'card-nome', opc.nome));
        if (opc.desc) b.append(el('span', 'card-desc' + (opc.classeDesc ? ' ' + opc.classeDesc : ''), opc.desc));
        return b;
    }

    function grade(cards, classe) {
        const g = el('div', 'grade-cards' + (classe ? ' ' + classe : ''));
        g.append(...cards);
        return g;
    }

    function renderTipo() {
        corpo.append(grade(TIPOS.map((t) => card({ ...t, selecionado: estado.tipo === t.chave }))));
    }

    function renderCategoria() {
        const lista = categorias();
        if (!lista.length) {
            corpo.append(el('p', 'estado-vazio', 'Você ainda não tem categorias no orçamento. Crie uma na página Orçamento.'));
            return;
        }
        corpo.append(grade(lista.map((cat) => {
            const restante = cat.planejado - gastoDe(cat);
            let desc = `${brl(restante)} restantes`;
            let classeDesc = '';
            if (restante < 0)        { desc = `${brl(-restante)} acima`; classeDesc = 'estourou'; }
            else if (restante === 0) { classeDesc = 'limite'; }
            return card({
                chave: cat.chave, nome: cat.nome, icone: cat.icone, cor: cat.cor,
                desc, classeDesc, selecionado: estado.categoria === cat.chave,
            });
        })));
    }

    function renderSubcategoria() {
        const cat = categoriaEscolhida();
        if (!cat) return;

        const resumo = el('div', 'categoria-escolhida');
        resumo.style.setProperty('--cor-item', corCss(cat.cor));
        const caixa = el('span', 'icone-caixa');
        caixa.append(icone(cat.icone));
        const texto = el('span', 'texto');
        texto.append(el('span', 'rotulo-pequeno', 'Categoria'), el('span', null, cat.nome));
        const trocar = el('button', 'btn-trocar', 'Trocar');
        trocar.type = 'button';
        trocar.dataset.acao = 'voltar';
        resumo.append(caixa, texto, trocar);

        const cards = subcategoriasDe(cat.chave).map((s) =>
            card({ chave: s.chave, nome: s.nome, icone: s.icone, cor: cat.cor, selecionado: estado.subcategoria === s.chave }, 'card-linha')
        );

        const novo = el('button', 'card-opcao card-linha card-novo');
        novo.type = 'button';
        novo.dataset.acao = 'nova-sub';
        novo.style.setProperty('--cor-item', corCss(cat.cor));
        novo.append(icone('plus'), el('span', 'card-nome', 'Nova subcategoria'));

        corpo.append(resumo, grade([...cards, novo], 'duas-colunas'));
    }

    function renderDestino() {
        corpo.append(grade(DESTINOS.map((d) => card({ ...d, selecionado: estado.destino === d.chave }))));
    }

    /* ---------- detalhes ---------- */

    function contextoDetalhes() {
        if (estado.tipo === 'despesa') {
            const cat = categoriaEscolhida();
            const sub = subEscolhida();
            return {
                partes: ['Despesa', cat?.nome, sub?.nome].filter(Boolean),
                cor: cat?.cor,
                placeholder: sub?.exemplo || `Ex: ${sub ? sub.nome : 'Compra'}`,
            };
        }
        if (estado.tipo === 'receita') {
            return { partes: ['Receita'], cor: 'var(--color-green)', placeholder: 'Ex: Salário de outubro' };
        }
        const dest = destinoEscolhido();
        return {
            partes: ['Investimento', dest?.nome].filter(Boolean),
            cor: dest?.cor,
            placeholder: dest ? dest.exemplo : 'Ex: Nome do ativo',
        };
    }

    function campo({ nome, rotulo, opcional, placeholder, tipoInput = 'text', max, multilinha, prefixo, modoInput }) {
        const wrap = el('div', 'campo-form');
        const label = el('label', null, rotulo);
        label.htmlFor = 'lanc-' + nome;
        if (opcional) label.append(' ', el('span', 'opcional', '(opcional)'));

        const entrada = el(multilinha ? 'textarea' : 'input');
        entrada.id = 'lanc-' + nome;
        entrada.dataset.campo = nome;
        if (!multilinha) entrada.type = tipoInput;
        if (placeholder) entrada.placeholder = placeholder;
        if (max) entrada.maxLength = max;
        if (modoInput) entrada.inputMode = modoInput;
        entrada.autocomplete = 'off';
        entrada.value = estado.form[nome];

        if (prefixo) {
            const caixa = el('div', 'input-valor-wrapper');
            caixa.append(el('span', 'prefixo-moeda', prefixo), entrada);
            wrap.append(label, caixa);
        } else {
            wrap.append(label, entrada);
        }
        return wrap;
    }

    function renderDetalhes() {
        const { partes, cor, placeholder } = contextoDetalhes();
        const ehInvest = estado.tipo === 'investimento';

        const crumb = el('div', 'breadcrumb');
        if (cor) crumb.style.setProperty('--cor-item', corCss(cor));
        partes.forEach((p, i) => {
            if (i > 0) crumb.append(el('span', 'sep', '›'));
            crumb.append(el('span', i === partes.length - 1 ? 'breadcrumb-atual' : null, p));
        });

        const linha = el('div', 'campo-linha');
        linha.append(
            campo({ nome: 'valor', rotulo: ehInvest ? 'Valor aportado (R$) *' : 'Valor (R$) *', placeholder: '0,00', prefixo: 'R$', modoInput: 'decimal', max: 12 }),
            campo({ nome: 'data', rotulo: 'Data *', tipoInput: 'date' })
        );

        const form = el('div', 'form-lancamento');
        if (cor) form.style.setProperty('--cor-item', corCss(cor));
        form.append(
            campo(ehInvest
                ? { nome: 'descricao', rotulo: 'Nome do ativo', opcional: true, placeholder, max: 60 }
                : { nome: 'descricao', rotulo: estado.tipo === 'despesa' ? 'Descrição / item *' : 'Descrição *', placeholder, max: 60 }),
            linha,
            campo({ nome: 'obs', rotulo: 'Observação', opcional: true, multilinha: true, placeholder: 'Adicione uma nota sobre este lançamento', max: 200 })
        );

        corpo.append(crumb, form);
    }

    function renderRodape(etapa) {
        rodape.replaceChildren();
        rodape.hidden = estado.passo === 0;
        dica.hidden = etapa === 'detalhes';
        if (estado.passo === 0) return;

        const voltarBtn = el('button', 'btn-rodape-voltar');
        voltarBtn.type = 'button';
        voltarBtn.dataset.acao = 'voltar';
        voltarBtn.append(icone('arrow-left'), document.createTextNode('Voltar'));
        rodape.append(voltarBtn);

        if (etapa === 'detalhes') {
            const salvarBtn = el('button', 'btn-confirmar-lancamento', 'Salvar lançamento');
            salvarBtn.type = 'button';
            salvarBtn.id = 'btn-confirmar-lancamento';
            salvarBtn.dataset.acao = 'salvar';
            salvarBtn.disabled = true;
            rodape.append(salvarBtn);
        }
    }

    /* ====================== NAVEGAÇÃO ====================== */

    function escolher(botao) {
        const chave = botao.dataset.escolha;
        const etapa = etapaAtual();

        if (etapa === 'tipo') {
            if (estado.tipo !== chave) {
                estado.categoria = estado.subcategoria = estado.destino = null;
            }
            estado.tipo = chave;
        } else if (etapa === 'categoria') {
            if (estado.categoria !== chave) estado.subcategoria = null;
            estado.categoria = chave;
        } else if (etapa === 'subcategoria') {
            estado.subcategoria = chave;
        } else if (etapa === 'destino') {
            estado.destino = chave;
        }

        // feedback rápido de seleção e avança sozinho
        botao.classList.add('selecionado');
        corpo.classList.add('travado');
        setTimeout(() => {
            corpo.classList.remove('travado');
            if (overlay.classList.contains('aberto')) avancar();
        }, 150);
    }

    function avancar() {
        if (estado.passo < fluxoAtual().length - 1) {
            estado.passo++;
            renderizar();
        }
    }

    function voltar() {
        if (estado.passo > 0) {
            estado.passo--;
            renderizar();
        }
    }

    /* ====================== NOVA SUBCATEGORIA ====================== */

    function mostrarCampoNovaSub() {
        const botaoNovo = corpo.querySelector('[data-acao="nova-sub"]');
        if (!botaoNovo) return;

        const bloco = el('div', 'novo-inline');
        const cor = categoriaEscolhida()?.cor;
        if (cor) bloco.style.setProperty('--cor-item', corCss(cor));

        const input = el('input');
        input.type = 'text';
        input.id = 'lanc-nova-sub';
        input.maxLength = 30;
        input.autocomplete = 'off';
        input.placeholder = 'Nome da subcategoria';
        input.setAttribute('aria-label', 'Nome da nova subcategoria');

        const add = el('button', 'btn-inline', 'Adicionar');
        add.type = 'button';
        add.dataset.acao = 'add-sub';

        bloco.append(input, add);
        botaoNovo.replaceWith(bloco);
        input.focus();
    }

    function mostrarErroSub(msg) {
        corpo.querySelector('.erro-campo')?.remove();
        const p = el('p', 'erro-campo', msg);
        p.setAttribute('role', 'alert');
        corpo.querySelector('.grade-cards').append(p);
    }

    function confirmarNovaSub() {
        const cat = categoriaEscolhida();
        const input = corpo.querySelector('#lanc-nova-sub');
        if (!cat || !input) return;

        const nome = input.value.trim().replace(/\s+/g, ' ');
        const chave = slug(nome);
        if (!nome || !chave) return mostrarErroSub('Digite um nome para a subcategoria.');

        const existente = subcategoriasDe(cat.chave).find((s) => s.nome.toLowerCase() === nome.toLowerCase());
        if (!existente) {
            (subcategoriasPorCategoria[cat.chave] ||= []).push({ chave, nome, icone: 'tag' });
        }
        estado.subcategoria = existente ? existente.chave : chave;
        avancar();
    }

    /* ====================== FORMULÁRIO ====================== */

    function validar() {
        const f = estado.form;
        const valorOk = parseValor(f.valor) > 0;
        const descOk = estado.tipo === 'investimento' || f.descricao.trim().length > 0;
        return valorOk && descOk && Boolean(f.data);
    }

    function atualizarBotaoSalvar() {
        const btn = document.getElementById('btn-confirmar-lancamento');
        if (!btn) return;
        const ok = validar();
        btn.disabled = !ok;
        btn.classList.toggle('ativo', ok);
    }

    function salvar() {
        if (!validar()) return;
        const f = estado.form;
        const valor = parseValor(f.valor);
        const lancamento = { tipo: estado.tipo, valor, data: f.data, observacao: f.obs.trim() };

        if (estado.tipo === 'despesa') {
            const cat = categoriaEscolhida();
            const sub = subEscolhida();
            if (!cat || !sub) return;
            const item = f.descricao.trim();
            Object.assign(lancamento, { categoria: cat.chave, subcategoria: sub.nome, icone: sub.icone, item });

            if (typeof historicoLancamentos !== 'undefined') {
                // ajuste o formato de "data" se o seu histórico usa outro (ex: dd/mm/aaaa)
                (historicoLancamentos[cat.chave] ||= []).push({
                    subcategoria: sub.nome, icone: sub.icone, item, valor, data: f.data,
                });
            }
        } else if (estado.tipo === 'receita') {
            lancamento.descricao = f.descricao.trim();
        } else {
            lancamento.destino = estado.destino;
            lancamento.ativo = f.descricao.trim();
        }

        document.dispatchEvent(new CustomEvent('lancamento:salvo', { detail: lancamento }));
        fechar();
    }

    /* ====================== EVENTOS ====================== */

    function aoClicar(e) {
        if (e.target === overlay) {
            if (cliqueComecouNoFundo) fechar(); // só fecha se o clique COMEÇOU no fundo
            return;
        }
        if (e.target.closest('#lanc-fechar')) return fechar();

        const escolha = e.target.closest('[data-escolha]');
        if (escolha) return escolher(escolha);

        const acao = e.target.closest('[data-acao]')?.dataset.acao;
        if (acao === 'voltar') voltar();
        else if (acao === 'salvar') salvar();
        else if (acao === 'nova-sub') mostrarCampoNovaSub();
        else if (acao === 'add-sub') confirmarNovaSub();
    }

    function aoDigitar(e) {
        const campoNome = e.target.dataset.campo;
        if (!campoNome) return;
        if (campoNome === 'valor') {
            // só dígitos e UMA vírgula (evita "12.50" ser lido como 1250)
            e.target.value = e.target.value.replace(/[^\d,]/g, '').replace(/,(?=.*,)/g, '');
        }
        estado.form[campoNome] = e.target.value;
        atualizarBotaoSalvar();
    }

    function aoTeclar(e) {
        if (e.target.id === 'lanc-nova-sub') {
            if (e.key === 'Enter') { e.preventDefault(); confirmarNovaSub(); }
            if (e.key === 'Escape') { e.stopPropagation(); renderizar(); }
            return;
        }
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.dataset.campo) {
            e.preventDefault();
            salvar();
        }
    }

    /* ====================== ABRIR / FECHAR ====================== */

    function iniciar() {
        if (iniciado) return true;
        overlay = document.getElementById('modal-lancamento');
        if (!overlay) {
            console.warn('[lancamento] #modal-lancamento não encontrado nesta página.');
            return false;
        }
        corpo     = document.getElementById('lanc-corpo');
        stepper   = document.getElementById('lanc-stepper');
        rodape    = document.getElementById('lanc-rodape');
        dica      = document.getElementById('lanc-dica');
        titulo    = document.getElementById('lanc-titulo');
        subtitulo = document.getElementById('lanc-subtitulo');

        overlay.addEventListener('mousedown', (e) => { cliqueComecouNoFundo = e.target === overlay; });
        overlay.addEventListener('click', aoClicar);
        overlay.addEventListener('input', aoDigitar);
        overlay.addEventListener('keydown', aoTeclar);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('aberto')) fechar();
        });

        iniciado = true;
        return true;
    }

    function abrir() {
        if (!iniciar()) return;
        estado = estadoInicial();
        overlay.classList.add('aberto');
        document.body.style.overflow = 'hidden';
        renderizar();
    }

    function fechar() {
        if (!overlay) return;
        overlay.classList.remove('aberto');
        document.body.style.overflow = '';
    }

    window.abrirModalLancamento = abrir;

    // qualquer elemento com data-abrir-lancamento abre o modal
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-abrir-lancamento]')) abrir();
    });
})();







