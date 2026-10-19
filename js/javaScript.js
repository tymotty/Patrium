
if (document.getElementById('lista-categorias-orcamento')) {

    // ------------------Orcamento------------------

    function criarCardCategoria(cat) {
        const percentual = Math.round((cat.gasto / cat.planejado) * 100);
        const estourou = percentual > 100;
        const larguraBarra = Math.min(percentual, 100);
        const corBarra = estourou ? 'var(--color-red)' : cat.cor;

        const card = document.createElement('div');
        card.className = 'categoria-orcamento';
        card.dataset.status = estourou ? 'estourou' : 'ok';
        card.dataset.categoria = cat.chave; 

        card.innerHTML = `
            <div class="categoria-info">
                <div class="categoria-orcamento-header">
                    <i data-lucide="${cat.icone}" class="icon-categoria" style="color: ${cat.cor};"></i>
                    <span class="categoria-nome">${cat.nome}</span>
                    ${estourou ? '<span class="tag-estourou">ESTOUROU</span>' : ''}
                </div>
                <div class="categoria-orcamento-valores">
                    <span class="valor-gasto ${estourou ? 'valor-negativo' : ''}">R$ ${cat.gasto.toLocaleString('pt-BR')}</span>
                    <span class="valor-separador">/</span>
                    <span class="valor-planejado">R$ ${cat.planejado.toLocaleString('pt-BR')}</span>
                    <span class="valor-percentual ${estourou ? 'valor-negativo' : ''}">${percentual}%</span>
                </div>
            </div>
            <div class="barra-progresso-container" role="progressbar" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100">
                <div class="barra-progresso" style="width: ${larguraBarra}%; background-color: ${corBarra};"></div>
            </div>

            <div class="categoria-detalhamento" id="detalhamento-${cat.chave}">
                <div class="detalhamento-header">
                    <span class="detalhamento-titulo">DETALHAMENTO</span>
                    <select class="detalhamento-filtro">
                        <option value="data">Mais recentes</option>
                        <option value="valor">Maior valor</option>
                        <option value="subcategoria">Subcategoria</option>
                    </select>
                </div>
                <div class="detalhamento-lista"></div>
            </div>

        `;

        return card;
    }



    function atualizarResumoOrcamento() {
        const totalPlanejado = categoriasOrcamento.reduce((soma, cat) => soma + cat.planejado, 0);
        const totalGasto = categoriasOrcamento.reduce((soma, cat) => soma + cat.gasto, 0);
        const saldo = totalPlanejado - totalGasto;
        const percentualTotal = Math.round((totalGasto / totalPlanejado) * 100);

        const categoriasEstouradas = categoriasOrcamento.filter(cat => cat.gasto > cat.planejado);
        const qtdEstouradas = categoriasEstouradas.length;
        const qtdTotal = categoriasOrcamento.length;

        const cards = document.querySelectorAll('.cards-metricas .widget.card');
        // cards[0] = Total Planejado | cards[1] = Total Gasto | cards[2] = Saldo | cards[3] = Categorias

        
        // --- Card 1: Total Planejado ---
        cards[0].querySelector('.card-value').textContent = `R$ ${totalPlanejado.toLocaleString('pt-BR')}`;

        // --- Card 2: Total Gasto ---
        cards[1].querySelector('.card-value').textContent = `R$ ${totalGasto.toLocaleString('pt-BR')}`;
        const descGasto = cards[1].querySelector('.card-description');
        descGasto.textContent = `${totalGasto > totalPlanejado ? '▼' : '▲'} ${percentualTotal}% do orçamento`;
        descGasto.classList.toggle('metrica-negativa', totalGasto > totalPlanejado);

        // --- Card 3: Saldo ---
        const valorSaldo = cards[2].querySelector('.card-value');
        valorSaldo.textContent = `R$ ${saldo.toLocaleString('pt-BR')}`;
        valorSaldo.classList.toggle('metrica-negativa', saldo < 0);

        const descSaldo = cards[2].querySelector('.card-description');
        descSaldo.textContent = saldo < 0 ? '▼ acima do limite' : '▲ Dentro do limite';
        descSaldo.classList.toggle('metrica-negativa', saldo < 0);

        // --- Card 4: Categorias ---
        cards[3].querySelector('.card-value').textContent = `${qtdEstouradas} de ${qtdTotal}`;
        const descCategorias = cards[3].querySelector('.card-description');
        descCategorias.textContent = qtdEstouradas > 0 ? '▼ Acima do orçamento' : '▲ Tudo sob controle';
        descCategorias.classList.toggle('metrica-negativa', qtdEstouradas > 0);

        // --- Banner de alerta ---
        const banner = document.getElementById('banner-alerta-orcamento');
        if (qtdEstouradas > 0) {
            const nomes = categoriasEstouradas.map(cat => cat.nome).join(', ');
            document.getElementById('lista-categorias-estouradas').textContent = nomes;
            banner.style.display = 'flex';
        } else {
            banner.style.display = 'none';
        }
    }



    // 1. Declarações de dados

    // Dados de categorias
    const categoriasOrcamento = [
        { chave: 'moradia', nome: 'Moradia', icone: 'house', cor: 'var(--color-blue)',  planejado: 2500 },
        { chave: 'alimentacao', nome: 'Alimentação', icone: 'utensils', cor: 'var(--color-gold)',  planejado: 1200 },
        { chave: 'transporte', nome: 'Transporte', icone: 'car', cor: 'var(--color-green)',  planejado: 300 },
        { chave: 'saude', nome: 'Saúde', icone: 'heart-pulse', cor: 'var(--color-red)',  planejado: 400 },
        { chave: 'lazer', nome: 'Lazer', icone: 'coffee', cor: 'var(--color-purple)',  planejado: 200 },
        { chave: 'educacao', nome: 'Educação', icone: 'book-open', cor: 'var(--color-light-gray)',  planejado: 600 },
        { chave: 'vestuario', nome: 'Vestuário', icone: 'shirt', cor: 'var(--color-green)',  planejado: 150 },
        { chave: 'outros', nome: 'Outros', icone: 'gift', cor: 'var(--color-red)',  planejado: 100 }
    ];

    //histórico de lançamentos
    const historicoLancamentos = {
        moradia: [
            { subcategoria: 'Aluguel', icone: 'house', item: 'Aluguel mensal', valor: 2200, data: '2026-09-05' },
            { subcategoria: 'Contas', icone: 'zap', item: 'Água e luz', valor: 300, data: '2026-09-10' }
        ],
        alimentacao: [
            { subcategoria: 'Lanche', icone: 'pizza', item: 'Pizza', valor: 23.59, data: '2026-09-19' },
            { subcategoria: 'Básico', icone: 'ham', item: 'Arroz, feijão', valor: 93.59, data: '2026-09-19' },
            { subcategoria: 'Básico', icone: 'ham', item: 'Verduras', valor: 45.00, data: '2026-09-15' },
            { subcategoria: 'Lanche', icone: 'pizza', item: 'Hambúrguer', valor: 32.00, data: '2026-09-10' },
            { subcategoria: 'Básico', icone: 'ham', item: 'Carnes', valor: 150.00, data: '2026-09-05' },
            { subcategoria: 'Básico', icone: 'ham', item: 'Frutas', valor: 60.00, data: '2026-09-01' },
            { subcategoria: 'Lanche', icone: 'pizza', item: 'Sorvete', valor: 20.00, data: '2026-09-02' },
            { subcategoria: 'Básico', icone: 'ham', item: 'Leite e ovos', valor: 30.00, data: '2026-09-03' },
            { subcategoria: 'Lanche', icone: 'pizza', item: 'Café da manhã', valor: 15.00, data: '2026-09-04' }
        ],
        transporte: [
            { subcategoria: 'Combustível', icone: 'fuel', item: 'Gasolina', valor: 150.00, data: '2026-09-12' },
            { subcategoria: 'Transporte público', icone: 'bus', item: 'Ônibus', valor: 50.00, data: '2026-09-14' },
            { subcategoria: 'Manutenção', icone: 'wrench', item: 'Troca de óleo', valor: 100.00, data: '2026-09-18' }
        ],
        saude: [
            { subcategoria: 'Plano de saúde', icone: 'heart-pulse', item: 'Mensalidade', valor: 300.00, data: '2026-09-01' },
            { subcategoria: 'Medicamentos', icone: 'pill', item: 'Remédio A', valor: 50.00, data: '2026-09-05' }
        ],
        lazer: [
            { subcategoria: 'Cinema', icone: 'film', item: 'Vingador Ultimato', valor: 30.00, data: '2026-09-20' },
            { subcategoria: 'Restaurante', icone: 'coffee', item: 'Jantar', valor: 80.00, data: '2026-09-18' },
            { subcategoria: 'Assinatura', icone: 'tv', item: 'Netflix', valor: 40.00, data: '2026-09-15' },
            { subcategoria: 'Assinatura', icone: 'music', item: 'Spotify', valor: 20.00, data: '2026-09-10' }
        ],
        educacao: [
            { subcategoria: 'Curso online', icone: 'book-open', item: 'Curso de JS', valor: 50.00, data: '2026-09-03' },
            { subcategoria: 'mensalidade', icone: 'graduation-cap', item: 'Faculdade', valor: 500.00, data: '2026-09-10' }
        ],
        vestuario: [
            { subcategoria: 'Calçado', icone: 'sport-shoe', item: 'Tênis', valor: 120.00, data: '2026-09-15' }
        ],
        outros: [
            { subcategoria: 'Assinatura', icone: 'credit-card', item: 'App X', valor: 20.00, data: '2026-09-19' }
        ]
        
    };
    function calcularGastoCategoria(chave) {
        const itens = historicoLancamentos[chave] || [];
        return itens.reduce((soma, item) => soma + item.valor, 0);
    }

    // 2. Montagem dos cards
    document.querySelectorAll('.categoria-orcamento').forEach(card => {
        console.log(
            card.dataset.categoria,
            '| header:', card.querySelector('.categoria-orcamento-header'),
            '| filtro:', card.querySelector('.detalhamento-filtro')
        );
    });
    // Monta todas as categorias na tela
    const listaContainer = document.getElementById('lista-categorias-orcamento');
    categoriasOrcamento.forEach(cat => {
        cat.gasto = calcularGastoCategoria(cat.chave);
        listaContainer.appendChild(criarCardCategoria(cat));
    });

    lucide.createIcons(); // renderiza os ícones inseridos via innerHTML
    atualizarResumoOrcamento();


    // 3. Listeners (cards já existem no DOM aqui)
    document.querySelectorAll('.categoria-orcamento').forEach(card => {
        const chave = card.dataset.categoria;
        const dadosCategoria = categoriasOrcamento.find(c => c.chave === chave);
        const corIcone = dadosCategoria ? dadosCategoria.cor : 'var(--text-white)';

        card.querySelector('.categoria-info').addEventListener('click', () => {
            toggleDetalhamento(chave, card, corIcone);
        });

        const filtro = card.querySelector('.detalhamento-filtro');
        filtro.addEventListener('click', e => e.stopPropagation());
        filtro.addEventListener('change', e => renderizarDetalhamento(chave, e.target.value, corIcone));
    });

    function toggleDetalhamento(chave, card, corIcone) {
        const jaExpandido = card.classList.contains('expandido');

        document.querySelectorAll('.categoria-orcamento.expandido').forEach(c => {
            if (c !== card) c.classList.remove('expandido');
        });

        card.classList.toggle('expandido');

        if (!jaExpandido) {
            renderizarDetalhamento(chave, 'data', corIcone);
        }
    }

    function renderizarDetalhamento(chave, criterio, corIcone) {
        const container = document.querySelector(`#detalhamento-${chave} .detalhamento-lista`);
        const itens = [...(historicoLancamentos[chave] || [])];

        itens.sort((a, b) => {
            if (criterio === 'valor') return b.valor - a.valor;
            if (criterio === 'subcategoria') return a.subcategoria.localeCompare(b.subcategoria);
            return new Date(b.data) - new Date(a.data);
        });

        container.innerHTML = itens.map(item => `
            <div class="item-detalhamento">
                <i data-lucide="${item.icone}" class="item-detalhamento-icon" style="color: ${corIcone};"></i>
                <span class="item-detalhamento-sub">${item.subcategoria}</span>
                <span class="item-detalhamento-nome">${item.item}</span>
                <span class="item-detalhamento-valor">R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span class="item-detalhamento-data">${formatarData(item.data)}</span>
            </div>
        `).join('');

        lucide.createIcons();
    }

    function formatarData(dataIso) {
        const [ano, mes, dia] = dataIso.split('-');
        return `${dia}/${mes}`;
    }
}

(function () {
  'use strict';
 
  // Regra do projeto: código de página específica só roda se a página for a certa
  const formPerfil = document.getElementById('form-perfil');
  if (!formPerfil) return;
 
  // ---------- Constantes ----------
  const CHAVE_STORAGE = 'patrium:conta';
  const MOEDAS_VALIDAS = ['BRL', 'USD', 'EUR'];
  const ICONES_VALIDOS = ['paw-print', 'repeat', 'heart-handshake', 'tag'];
  const CORES = ['#fbbf24', '#3b82f6', '#00e5a8', '#a78bfa', '#f87171', '#fb923c'];
  const MAX_CATEGORIAS = 20;
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const REGEX_COR = /^#[0-9a-f]{6}$/i;
 
  const PADRAO = {
    perfil: { nome: 'Lucas Mendes', email: 'lucas@email.com', moeda: 'BRL' },
    categorias: [
      { chave: 'pets', nome: 'Pets', icone: 'paw-print', cor: '#fbbf24' },
      { chave: 'assinaturas', nome: 'Assinaturas', icone: 'repeat', cor: '#3b82f6' },
      { chave: 'doacoes', nome: 'Doações', icone: 'heart-handshake', cor: '#00e5a8' }
    ]
  };
 
  // ---------- Elementos ----------
  const inputNome = document.getElementById('perfil-nome');
  const inputEmail = document.getElementById('perfil-email');
  const selectMoeda = document.getElementById('perfil-moeda');
  const feedbackPerfil = document.getElementById('perfil-feedback');
  const nomeExibido = document.getElementById('perfil-nome-exibido');
  const avatarPerfil = document.getElementById('perfil-avatar');
 
  const listaCategorias = document.getElementById('lista-categorias');
  const formNovaCategoria = document.getElementById('form-nova-categoria');
  const inputNovaCategoria = document.getElementById('nova-categoria');
 
  // ---------- Armazenamento (trocar por dados.js depois) ----------
  function copiarPadrao() {
    return JSON.parse(JSON.stringify(PADRAO));
  }
 
  // Tudo que vem do localStorage é tratado como não confiável: valida antes de usar
  function lerDados() {
    try {
      const bruto = localStorage.getItem(CHAVE_STORAGE);
      if (!bruto) return copiarPadrao();
 
      const dados = JSON.parse(bruto);
      const padrao = copiarPadrao();
 
      const perfil = dados && dados.perfil ? dados.perfil : {};
      const nome = typeof perfil.nome === 'string' ? perfil.nome.trim().slice(0, 60) : '';
      const email = typeof perfil.email === 'string' ? perfil.email.trim().slice(0, 120) : '';
      const moeda = MOEDAS_VALIDAS.includes(perfil.moeda) ? perfil.moeda : padrao.perfil.moeda;
 
      const categorias = Array.isArray(dados && dados.categorias)
        ? dados.categorias
            .filter((c) => c && typeof c.nome === 'string' && typeof c.chave === 'string')
            .slice(0, MAX_CATEGORIAS)
            .map((c) => ({
              chave: c.chave.slice(0, 40),
              nome: c.nome.trim().slice(0, 30),
              icone: ICONES_VALIDOS.includes(c.icone) ? c.icone : 'tag',
              cor: REGEX_COR.test(c.cor) ? c.cor : CORES[0]
            }))
            .filter((c) => c.nome.length > 0)
        : padrao.categorias;
 
      return {
        perfil: {
          nome: nome || padrao.perfil.nome,
          email: REGEX_EMAIL.test(email) ? email : padrao.perfil.email,
          moeda: moeda
        },
        categorias: categorias
      };
    } catch (erro) {
      // JSON quebrado ou localStorage bloqueado: volta para o padrão
      return copiarPadrao();
    }
  }
 
  function salvarDados(dados) {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
      return true;
    } catch (erro) {
      return false; // cota cheia ou modo privado
    }
  }
 
  let dados = lerDados();
 
  // ---------- Utilidades ----------
  function limparEspacos(texto) {
    return texto.replace(/\s+/g, ' ').trim();
  }
 
  // "Doações" -> "doacoes" (a chave precisa bater com a do categoriasOrcamento)
  function gerarChave(nome) {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
 
  function iniciais(nome) {
    const partes = limparEspacos(nome).split(' ').filter(Boolean);
    if (partes.length === 0) return '?';
    if (partes.length === 1) return Array.from(partes[0]).slice(0, 2).join('').toUpperCase();
    const primeira = Array.from(partes[0])[0];
    const ultima = Array.from(partes[partes.length - 1])[0];
    return (primeira + ultima).toUpperCase();
  }
 
  let timerFeedback = null;
  function mostrarFeedback(elemento, mensagem, erro) {
    elemento.textContent = mensagem; // textContent: nunca innerHTML
    elemento.classList.toggle('conta-feedback-erro', Boolean(erro));
    clearTimeout(timerFeedback);
    if (!erro) {
      timerFeedback = setTimeout(() => { elemento.textContent = ''; }, 3000);
    }
  }
 
  function atualizarIcones() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
 
  // ---------- PERFIL ----------
  function preencherPerfil() {
    inputNome.value = dados.perfil.nome;
    inputEmail.value = dados.perfil.email;
    selectMoeda.value = dados.perfil.moeda;
    atualizarCabecalhoPerfil();
  }
 
  function atualizarCabecalhoPerfil() {
    nomeExibido.textContent = dados.perfil.nome;
    avatarPerfil.textContent = iniciais(dados.perfil.nome);
  }
 
  function validarPerfil(nome, email, moeda) {
    if (nome.length < 2 || nome.length > 60) {
      return { campo: inputNome, mensagem: 'O nome precisa ter entre 2 e 60 caracteres.' };
    }
    if (!REGEX_EMAIL.test(email) || email.length > 120) {
      return { campo: inputEmail, mensagem: 'Digite um e-mail válido.' };
    }
    if (!MOEDAS_VALIDAS.includes(moeda)) {
      return { campo: selectMoeda, mensagem: 'Escolha uma moeda da lista.' };
    }
    return null;
  }
 
  formPerfil.addEventListener('submit', function (evento) {
    evento.preventDefault();
 
    [inputNome, inputEmail, selectMoeda].forEach((c) => c.removeAttribute('aria-invalid'));
 
    const nome = limparEspacos(inputNome.value);
    const email = inputEmail.value.trim();
    const moeda = selectMoeda.value;
 
    const erro = validarPerfil(nome, email, moeda);
    if (erro) {
      erro.campo.setAttribute('aria-invalid', 'true');
      erro.campo.focus();
      mostrarFeedback(feedbackPerfil, erro.mensagem, true);
      return;
    }
 
    dados.perfil = { nome: nome, email: email, moeda: moeda };
    atualizarCabecalhoPerfil();
    inputNome.value = nome;
 
    if (salvarDados(dados)) {
      mostrarFeedback(feedbackPerfil, 'Alterações salvas.', false);
      document.dispatchEvent(new CustomEvent('perfil:salvo', { detail: dados.perfil }));
    } else {
      mostrarFeedback(feedbackPerfil, 'Não foi possível salvar neste navegador.', true);
    }
  });
 
  // ---------- CATEGORIAS PERSONALIZADAS ----------
  function criarItemCategoria(categoria) {
    const li = document.createElement('li');
    li.className = 'conta-item';
    li.dataset.categoria = categoria.chave;
 
    const iconeWrap = document.createElement('span');
    iconeWrap.className = 'conta-item-icone';
    iconeWrap.style.setProperty('--cor-item', categoria.cor);
    const icone = document.createElement('i');
    icone.setAttribute('data-lucide', categoria.icone);
    iconeWrap.appendChild(icone);
 
    const nome = document.createElement('span');
    nome.className = 'conta-item-nome';
    nome.textContent = categoria.nome; // texto digitado: sempre textContent
 
    const botao = document.createElement('button');
    botao.className = 'conta-item-remover';
    botao.type = 'button';
    botao.setAttribute('aria-label', 'Remover categoria ' + categoria.nome);
    const iconeX = document.createElement('i');
    iconeX.setAttribute('data-lucide', 'x');
    botao.appendChild(iconeX);
 
    li.append(iconeWrap, nome, botao);
    return li;
  }
 
  function renderizarCategorias() {
    const itens = dados.categorias.map(criarItemCategoria);
    listaCategorias.replaceChildren(...itens);
    atualizarIcones();
  }
 
  function notificarCategorias() {
    document.dispatchEvent(new CustomEvent('categorias:alteradas', { detail: dados.categorias }));
  }
 
  formNovaCategoria.addEventListener('submit', function (evento) {
    evento.preventDefault();
    inputNovaCategoria.removeAttribute('aria-invalid');
 
    const nome = limparEspacos(inputNovaCategoria.value);
    const chave = gerarChave(nome);
 
    let mensagemErro = '';
    if (nome.length < 2 || nome.length > 30) {
      mensagemErro = 'O nome da categoria precisa ter entre 2 e 30 caracteres.';
    } else if (!chave) {
      mensagemErro = 'Use letras ou números no nome da categoria.';
    } else if (dados.categorias.some((c) => c.chave === chave)) {
      mensagemErro = 'Essa categoria já existe.';
    } else if (dados.categorias.length >= MAX_CATEGORIAS) {
      mensagemErro = 'Limite de ' + MAX_CATEGORIAS + ' categorias atingido.';
    }
 
    if (mensagemErro) {
      inputNovaCategoria.setAttribute('aria-invalid', 'true');
      inputNovaCategoria.setCustomValidity(mensagemErro);
      inputNovaCategoria.reportValidity();
      inputNovaCategoria.setCustomValidity('');
      return;
    }
 
    dados.categorias.push({
      chave: chave,
      nome: nome,
      icone: 'tag',
      cor: CORES[dados.categorias.length % CORES.length]
    });
 
    salvarDados(dados);
    renderizarCategorias();
    notificarCategorias();
    inputNovaCategoria.value = '';
    inputNovaCategoria.focus();
  });
 
  // Um único listener na lista (funciona também para itens criados depois)
  listaCategorias.addEventListener('click', function (evento) {
    const botao = evento.target.closest('.conta-item-remover');
    if (!botao) return;
 
    const item = botao.closest('.conta-item');
    if (!item) return;
 
    const chave = item.dataset.categoria;
    dados.categorias = dados.categorias.filter((c) => c.chave !== chave);
 
    salvarDados(dados);
    renderizarCategorias();
    notificarCategorias();
  });

  // ---------- Início ----------
  preencherPerfil();
renderizarCategorias();
