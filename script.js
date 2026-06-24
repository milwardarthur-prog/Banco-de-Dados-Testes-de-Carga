const EQUIPAMENTOS = [
    "GE-02-50", "GE-03-40", "GE-04-55", "GE-05-55", "GE-06-115", "GE-09-170", "GE-10-25", "GE-11-75",
    "GE-12-75", "GE-13-500", "GE-14-140", "GE-15-170", "GE-16-40", "GE-17-81", "GE-18-100", "GE-19-81",
    "GE-20-54", "GE-21-54", "GE-22-54", "GE-23-54", "GE-24-54", "GE-25-60", "GE-26-75", "GE-27-180",
    "GE-28-81", "GE-29-85", "GE-30-105", "GE-31-105", "GE-32-115", "GE-33-115", "GE-34-115", "GE-35-150",
    "GE-36-150", "GE-37-180", "GE-38-180", "GE-39-180", "GE-40-180", "GE-41-220", "GE-42-450", "GE-43-450",
    "GE-44-260", "GE-45-40", "GE-46-25", "GE-47-115", "GE-48-15", "GE-49-55", "GE-50-55", "GE-51-550",
    "GE-52-212", "GE-53-140", "GE-54-55", "GE-55-55", "GE-56-55", "GE-57-55", "GE-58-81", "GE-59-180",
    "GE-60-180", "GE-61-230", "GE-62-81", "GE-63-40", "GE-64-55", "GE-65-230", "GE-66-80", "GE-67-100",
    "GE-68-50", "GE-69-260", "GE-70-40", "GE-71-81", "GE-72-140", "GE-73-260", "GE-74-375", "GE-75-25",
    "GE-76-81", "GE-77-140", "GE-78-81", "GE-79-81", "GE-80-81", "GE-81-50", "GE-82-100", "GE-83-140",
    "GE-84-81", "GE-85-140", "GE-86-81", "GE-87-81", "GE-88-55", "GE-89-55", "GE-90-20", "GE-91-70",
    "GE-92-80", "GE-93-85", "GE-94-200", "GE-95-460", "GE-96-27", "GE-97-33", "GE-98-250", "GE-99-36",
    "GE-100-125", "GE-101-12", "GE-102-55", "GE-103-150", "GE-104-65", "GE-105-45", "GE-106-500", "GE-107-230",
    "GE-108-125", "GE-109-25", "GE-110-80", "GE-111-125", "GE-112-125", "GE-113-360", "GE-114-360"
];

let dadosMaster = [];

function carregarCSV() {
    renderizar(EQUIPAMENTOS);
    document.getElementById('stats').innerText = `0 de ${EQUIPAMENTOS.length} equipamentos (Lendo banco...)`;

    Papa.parse("dados.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        downloadRequestHeaders: { "Cache-Control": "no-cache" },
        complete: function(results) {
            if (results.data && results.data.length > 0) {
                dadosMaster = results.data;
                atualizarStats();
                renderizar(EQUIPAMENTOS);
            } else {
                document.getElementById('stats').innerText = `0 de ${EQUIPAMENTOS.length} equipamentos (CSV vazio)`;
            }
        },
        error: function(err) {
            console.warn("Aviso: dados.csv não encontrado ou inacessível.");
            document.getElementById('stats').innerText = `0 de ${EQUIPAMENTOS.length} equipamentos (Sem banco de dados)`;
            renderizar(EQUIPAMENTOS);
        }
    });
}

function atualizarStats() {
    const comDados = EQUIPAMENTOS.filter(e => dadosMaster.some(d => d.Equipamento === e)).length;
    document.getElementById('stats').innerText = `${comDados} de ${EQUIPAMENTOS.length} equipamentos com testes`;
}

function renderizar(lista) {
    const grid = document.getElementById('equipmentsGrid');
    grid.innerHTML = "";

    lista.sort().forEach(nome => {
        const temHistorico = dadosMaster.some(d => d.Equipamento === nome);
        const card = document.createElement('div');
        card.className = `card ${temHistorico ? 'has-data' : ''}`;
        card.innerHTML = `
            <span class="card-title">${nome}</span>
            ${temHistorico ? '<span class="status-icon"><i class="fas fa-check-circle"></i> TESTADO</span>' : ''}
        `;
        card.onclick = () => abrirHistorico(nome);
        grid.appendChild(card);
    });
}

function abrirHistorico(nome) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');

    title.innerText = nome;
    const historico = dadosMaster.filter(d => d.Equipamento === nome);

    if (historico.length > 0) {
        let tabela = `<table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tensão</th>
                    <th>Vazio (Hz)</th>
                    <th>Carga (A)</th>
                    <th>Carga (Hz)</th>
                </tr>
            </thead>
            <tbody>`;

        [...historico].reverse().forEach(row => {
            tabela += `
                <tr>
                    <td>${row.Data || '-'}</td>
                    <td>${row.Tensao_Vazio || '-'}</td>
                    <td>${row.Frequencia_Vazio || '-'}</td>
                    <td>${row.Amperagem || '-'}</td>
                    <td>${row.Frequencia_Carga || '-'}</td>
                </tr>`;
        });

        tabela += `</tbody></table>`;
        modalBody.innerHTML = tabela;
    } else {
        modalBody.innerHTML = `
            <div style="text-align:center; padding: 40px; color: #94a3b8">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem"></i>
                <p>Nenhum histórico encontrado para este equipamento.</p>
            </div>`;
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// Busca
document.getElementById('searchInput').oninput = (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = EQUIPAMENTOS.filter(eq => eq.toLowerCase().includes(termo));
    renderizar(filtrados);
};

// Fechar Modal
const fechar = () => {
    document.getElementById('modal').style.display = "none";
    document.body.style.overflow = "auto";
};
document.getElementById('closeModal').onclick = fechar;
window.onclick = (e) => { if (e.target.id === 'modal') fechar(); };

// Início
carregarCSV();