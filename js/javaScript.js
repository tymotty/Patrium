
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