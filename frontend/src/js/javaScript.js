// Pega os elementos que vamos manipular
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

// Botão "voltar" da etapa 2 retorna pra etapa 1
btnVoltar.addEventListener('click', () => {
    etapa2.style.display = 'none';
    etapa1.style.display = 'block';
});