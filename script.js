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

let dadosHistorico = [];

// Carregar dados automaticamente do dados.csv
window.onload = () => {
    Papa.parse("dados.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            dadosHistorico = results.data;
            renderGrid();
        },
        error: function() {
            console.log("Arquivo dados.csv não encontrado ou vazio. Usando lista padrão.");
            renderGrid();
        }
    });
};

function renderGrid(filter = "") {
    const grid = document.getElementById('equipmentsGrid');
    grid.innerHTML = "";
    
    EQUIPAMENTOS.filter(e => e.toLowerCase().includes(filter.toLowerCase())).forEach(equip => {
        const div = document.createElement('div');
        const temDados = dadosHistorico.some(d => d.Equipamento === equip);
        
        div.className = `equip-card ${temDados ? 'has-data' : ''}`;
        div.textContent = equip;
        div.onclick = () => openModal(equip);
        grid.appendChild(div);
    });
}

function openModal(equip) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const container = document.getElementById('historyTableContainer');
    
    title.textContent = `Histórico: ${equip}`;
    const historicoFiltrado = dadosHistorico.filter(d => d.Equipamento === equip);
    
    if (historicoFiltrado.length > 0) {
        let html = `<table><thead><tr>
            <th>Data</th>
            <th>Tensão Vazio</th>
            <th>Freq. Vazio</th>
            <th>Amperagem</th>
            <th>Freq. Carga</th>
        </tr></thead><tbody>`;
        
        historicoFiltrado.forEach(row => {
            html += `<tr>
                <td>${row.Data || '-'}</td>
                <td>${row.Tensao_Vazio || '-'}</td>
                <td>${row.Frequencia_Vazio || '-'}</td>
                <td>${row.Amperagem || '-'}</td>
                <td>${row.Frequencia_Carga || '-'}</td>
            </tr>`;
        });
        html += `</tbody></table>`;
        container.innerHTML = html;
    } else {
        container.innerHTML = "<p style='text-align:center; color:#94a3b8; padding: 20px;'>Nenhum teste registrado para este equipamento.</p>";
    }
    
    modal.style.display = "block";
}

// Lógica de busca
document.getElementById('searchInput').oninput = (e) => {
    renderGrid(e.target.value);
};

// Fechar modal
document.getElementById('closeModal').onclick = () => document.getElementById('modal').style.display = "none";
window.onclick = (event) => {
    if (event.target == document.getElementById('modal')) document.getElementById('modal').style.display = "none";
}