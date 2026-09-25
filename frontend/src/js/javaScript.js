// Elementos
const modal = document.getElementById('modal-lancamento');
const btnAbrirModal = document.getElementById('nav-lancamentos');
const btnsFechar = document.querySelectorAll('.btn-fechar-modal');
const etapa1 = document.querySelector('[data-etapa="1"]');
const etapa2 = document.querySelector('[data-etapa="2"]');
const opcoesLancamento = document.querySelectorAll('.opcao-lancamento');
const btnVoltar = document.querySelector('.btn-voltar');

// Abrir o modal (mostra a etapa 1)
btnAbrirModal.addEventListener('click', () => {
    modal.classList.add('aberto');
});

// Fechar o modal (qualquer um dos X)
btnsFechar.forEach(botao => {
    botao.addEventListener('click', () => {
        modal.classList.remove('aberto');
    });
});

// Ao clicar numa categoria, vai pra etapa 2
opcoesLancamento.forEach(botao => {
    botao.addEventListener('click', () => {
        etapa1.style.display = 'none';
        etapa2.style.display = 'block';
    });
});

// Categorias da etapa 2
const categorias = {
    despesas: {
        titulo: 'Despesas',
        cor: '#F43F5E', 
        itens: [
            { nome: 'Aluguel', cor: '#F43F5E' },
            { nome: 'Água e luz', cor: '#3B82F6' },
            { nome: 'Mercado', cor: '#FFB800' },
            { nome: 'Internet', cor: '#A78BFA' }
        ]
    },
    investimento: {
        titulo: 'Investimento',
        cor: '#00E593', 
        itens: [
            { nome: 'Ações BR', cor: '#00E593' },
            { nome: 'FIIs', cor: '#3B82F6' },
            { nome: 'Renda Fixa', cor: '#FFB800' },
            { nome: "Int'l ETF", cor: '#A78BFA' },
            { nome: 'Cripto', cor: '#F43F5E' }
        ]
    },
    emergencia: {
        titulo: 'Emergencia',
        cor: '#FFB800',
        itens: [
            { nome: 'CDB Liquidez', cor: '#00E593' },
            { nome: 'Tesouro Selic', cor: '#FFB800' }
        ],
    },
    lazer: {
        titulo: 'Lazer',
        cor: '#A78BFA', 
        itens: [
            { nome: 'Restaurantes', cor: '#F43F5E' },
            { nome: 'Streaming', cor: '#A78BFA' },
            { nome: 'Viagens', cor: '#FFB800' },
            { nome: 'Academia', cor: '#3B82F6' }
        ]
    }
};
//Cores Etapa 3



//Botao Voltar
document.getElementById('btn-voltar-etapa2').addEventListener('click', () => {
    mostrarEtapa('etapa1');
});
//Volta ou fecha o modal se clicar fora dele
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('aberto');
    }
});
//reseta o modal
function fecharModal() {
    modal.classList.remove('aberto');
    mostrarEtapa('etapa1');
}
function abrirEtapa2(chaveCategoria) {
    const categoria = categorias[chaveCategoria]; // pega os dados daquela categoria

    // Atualiza o título da etapa 2
    document.getElementById('etapa2-titulo').textContent = 'Escolha o Item';
    document.getElementById('etapa2-subtitulo').textContent = `${categoria.titulo} · selecione o item`;

    // Pega o container onde a lista de itens vai ser inserida
    const listaContainer = document.getElementById('lista-opcoes-etapa2');
    listaContainer.innerHTML = ''; // limpa qualquer conteúdo anterior

    // Para cada item da categoria, cria um botão e adiciona na lista
    categoria.itens.forEach(item => {
        const botao = document.createElement('button');
        botao.className = 'item-lista';
        botao.dataset.nome = item.nome; // guarda o nome
        botao.style.setProperty('--cor-item', item.cor); // cor houver
        botao.innerHTML = `
            <span class="legenda-cor" style="background-color: ${item.cor}"></span>
            <span>${item.nome}</span>
            <span class="seta">→</span>
        `;

        botao.addEventListener('click', () => {
            avancarParaEtapa3(item, categoria);
        });
        listaContainer.appendChild(botao); // adiciona o botão na tela
    });

    mostrarEtapa('etapa2');
}
// Uma função auxiliar pra trocar de etapa 
function mostrarEtapa(idEtapaMostrar) {
    document.querySelectorAll('.modal-conteudo').forEach(etapa => {
        etapa.style.display = 'none'; // esconde todas as etapas
    });
    document.getElementById(idEtapaMostrar).style.display = 'block'; // mostra só a pedida
}

// Conecta os cliques da etapa 1 com a função de abrir etapa 2
//Despesas
document.getElementById('btn-lancamento-despesas').addEventListener('click', () => {
    abrirEtapa2('despesas');
});
//Investimento
document.getElementById('btn-lancamento-investimento').addEventListener('click', () => {
    abrirEtapa2('investimento');
});
//Emergencia
document.getElementById('btn-lancamento-emergencia').addEventListener('click', () => {
    abrirEtapa2('emergencia');
});
//Lazer
document.getElementById('btn-lancamento-lazer').addEventListener('click', () => {
    abrirEtapa2('lazer');
});

//Etapa 3
function avancarParaEtapa3(item, categoria) {
    document.getElementById('etapa3-titulo').textContent = item.nome;
    document.getElementById('input-descricao').value = item.nome;

    const tagCategoria = document.getElementById('etapa3-tag-categoria');
    tagCategoria.textContent = categoria.titulo;
    tagCategoria.style.setProperty('--cor-tag', categoria.cor);

    const tagItem = document.getElementById('etapa3-tag-item');
    tagItem.textContent = item.nome;
    tagItem.style.setProperty('--cor-tag', item.cor);

    document.getElementById('input-descricao').style.setProperty('--cor-item', item.cor);

    mostrarEtapa('etapa3');
}

document.getElementById('input-valor').addEventListener('input', (e) => {
    const btn = document.getElementById('btn-confirmar-lancamento');
    const valor = e.target.value.replace(/[^\d]/g, '');

    if (valor && Number(valor) > 0) {
        btn.classList.add('ativo');
        btn.disabled = false;
    } else {
        btn.classList.remove('ativo');
        btn.disabled = true;
    }
});
//Volta etapa 2
document.getElementById('btn-voltar-etapa3').addEventListener('click', () => {
    mostrarEtapa('etapa2');
});









// ------------------Orcamento------------------

//barra de progresso 
function criarCardCategoria(cat) {
    const percentual = Math.round((cat.gasto / cat.planejado) * 100);
    const estourou = percentual > 100;
    const larguraBarra = Math.min(percentual, 100);

    const card = document.createElement('div');
    card.className = 'categoria-orcamento';
    card.dataset.status = estourou ? 'estourou' : 'ok';

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
            <div class="barra-progresso" style="width: ${larguraBarra}%; background-color: ${cat.cor};"></div>
        </div>
    `;

    return card;
}

// Monta todas as categorias na tela
const listaContainer = document.getElementById('lista-categorias-orcamento');
categoriasOrcamento.forEach(cat => {
    listaContainer.appendChild(criarCardCategoria(cat));
});

lucide.createIcons(); // renderiza os ícones inseridos via innerHTML

///------------------------------------ORCAMENTO------------------------------
const historicoLancamentos = {
    alimentacao: [
        { subcategoria: 'Lanche', icone: 'sandwich', item: 'Pizza', valor: 23.59, data: '2026-09-19' },
        { subcategoria: 'Básico', icone: 'beef', item: 'Arroz, feijão', valor: 93.59, data: '2026-09-19' },
        { subcategoria: 'Básico', icone: 'beef', item: 'Verduras', valor: 45.00, data: '2026-09-15' },
        { subcategoria: 'Lanche', icone: 'sandwich', item: 'Hambúrguer', valor: 32.00, data: '2026-09-10' }
    ],
    moradia: [
        { subcategoria: 'Aluguel', icone: 'house', item: 'Aluguel mensal', valor: 2200, data: '2026-09-05' },
        { subcategoria: 'Contas', icone: 'zap', item: 'Água e luz', valor: 300, data: '2026-09-10' }
    ]
    // mais categoia
};



document.querySelectorAll('.categoria-orcamento').forEach(card => {
    const chave = card.dataset.categoria;

    card.querySelector('.categoria-orcamento-header').addEventListener('click', () => {
        toggleDetalhamento(chave, card);
    });

    const filtro = card.querySelector('.detalhamento-filtro');
    filtro.addEventListener('click', e => e.stopPropagation());
    filtro.addEventListener('change', e => renderizarDetalhamento(chave, e.target.value));
});

function toggleDetalhamento(chave, card) {
    const jaExpandido = card.classList.contains('expandido');

    document.querySelectorAll('.categoria-orcamento.expandido').forEach(c => {
        if (c !== card) c.classList.remove('expandido');
    });

    card.classList.toggle('expandido');

    if (!jaExpandido) {
        renderizarDetalhamento(chave, 'data');
    }
}

function renderizarDetalhamento(chave, criterio) {
    const container = document.querySelector(`#detalhamento-${chave} .detalhamento-lista`);
    const itens = [...(historicoLancamentos[chave] || [])];

    itens.sort((a, b) => {
        if (criterio === 'valor') return b.valor - a.valor;
        if (criterio === 'subcategoria') return a.subcategoria.localeCompare(b.subcategoria);
        return new Date(b.data) - new Date(a.data);
    });

    container.innerHTML = itens.map(item => `
        <div class="item-detalhamento">
            <i data-lucide="${item.icone}" class="item-detalhamento-icon"></i>
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