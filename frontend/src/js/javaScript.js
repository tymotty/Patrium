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
