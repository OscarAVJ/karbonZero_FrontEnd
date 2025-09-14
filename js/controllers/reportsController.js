import * as Alerts from '../../utils/alerts.js'
import { getAllConsumptionsByFiltersMonth } from '../services/consumptionService.js';

///Nuestro doc sirve para poder guardar todos los elementos y posteriormente mostrarlos en el "cuaderno" notebook
const doc = [];

///Aca definimos nuestros elementos
const typeElements = {
    1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6',
    7: 'p', 10: 'table'
};

const uid = () => Math.random().toString(36).slice(2, 9);
let dragId = null;

export async function loadResouceSelect(data, container) {
    data.forEach(element => {
        container.innerHTML += `
        <option value="${element.resourceName}">${element.resourceName} (${element.purity}) (${element.measureUnitName}):</option>
        `
    })
}

export async function exportToExcel(initData, lastData, resourceSelected, resources) {
    const init = initData.value.split("-");
    const final = lastData.value.split("-");
    const initDate = `${init[2]}/${init[1]}/${init[0]}`
    const finalDate = `${final[2]}/${final[1]}/${final[0]}`

    if (!validateValues(initData, lastData, resourceSelected.value)) {
        Alerts.showToastCloseInfo("Favor seleccionar el filtro de fechas y el nombre del recurso");
        return;
    }

    const resourceNames = [...new Set(
        (resources || []).map(r => r?.value ?? r?.nameR ?? r).filter(Boolean)
    )];

    if (resourceNames.length === 0) {
        Alerts.showToastCloseInfo("Selecciona al menos un recurso.");
        return;
    }

    const wb = new ExcelJS.Workbook();

    for (const resName of resourceNames) {
        let resp;
        try {
            resp = await getAllConsumptionsByFiltersMonth(resName, initDate, finalDate);
        } catch (e) {
            continue;
        }

        const data = resp
        const ws = wb.addWorksheet(resName);

        ws.columns = [
            { header: '#', key: 'idx', width: 6 },
            { header: 'Recurso', key: 'recurso', width: 20 },
            { header: 'Usuario', key: 'usuario', width: 18 },
            { header: 'Cantidad', key: 'cantidad', width: 12 },
            { header: 'Fecha', key: 'fecha', width: 14 },
            { header: 'Costo', key: 'costo', width: 12 },
        ];

        const headerRow = ws.getRow(1);

        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF008000' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        data.forEach((c, i) => {
            const raw = (c.consumptionDate ?? "").split(" ")[0];
            const iso = raw.includes("/") ? raw.split("/").reverse().join("-") : raw;
            const d = new Date(iso);
            const fechaCell = Number.isNaN(d.getTime()) ? raw : d;

            ws.addRow({
                idx: i + 1,
                recurso: c.resourcePurityName ?? resName,
                usuario: c.userName ?? "",
                cantidad: Number(c.quantity ?? 0),
                fecha: fechaCell,
                costo: Number(c.cost ?? 0),
            });
        });

        ws.getColumn('cantidad').numFmt = '0';
        ws.getColumn('costo').numFmt = '0.00';
        ws.getColumn('fecha').numFmt = 'dd/m/yyyy';

        ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;
            row.alignment = { vertical: 'middle' };
            row.eachCell({ includeEmpty: false }, (cell) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
            if (rowNumber % 2 === 0) {
                row.eachCell({ includeEmpty: false }, (cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
                });
            }
        });
    }

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RegistroDeConsumo_${initDate}_a_${finalDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
}



export function exportToPdf(notebookEl) {
    document.querySelectorAll('.controls').forEach(el => el.style.display = 'none');
    if (notebookEl.length === 0) {
        Alerts.showToastCloseInfo("Agrega al menos un elemento.");
        return;
    }
    const file = {
        margin: [20, 16, 20, 16],
        filename: `karbonzero-report${uid()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.cell-header', 'tr'] }
    };

    html2pdf()
        .set(file)
        .from(notebookEl)
        .save()
        .then(() => {
            document.querySelectorAll('.controls').forEach(el => el.style.display = '');
        });
}

export function renderNotebook(notebook) {
    if (doc.length === 0) {
        notebook.innerHTML = `
        <section id="firstLoadNotebook" class="d-flex align-items-center max-vh-100 py-5">
            <div class="container py-5">
                <div class="row align-items-center d-flex justify-content-between">
                    <div class="col-md-6 order-md-2">
                        <div class="lc-block">
                            <img class="img-fluid" src="../assets/imgs/helloParrot.png"></img>
                        </div>
                    </div>
                    <div class="col-md-6 text-center text-md-start ">
                        <div class="lc-block mb-3">
                            <div editable="rich">
                                <h1 class="display-1 fw-bold text-success">¡Crea tus reportes!</h1>

                            </div>
                        </div>
                        <div class="lc-block mb-5">
                            <div editable="rich">
                                <p class="rfs-11 fw-light">Crea tus reportes personalizados con los diversos elementos disponibles y exportalos al tipo de documento de tu preferencia.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }else{
        notebook.innerHTML = ''
    }
    doc.forEach((cell) => {
        const el = document.createElement('div');
        el.className = 'cell';
        el.draggable = true;
        el.dataset.id = cell.id;

        el.addEventListener('dragstart', onDragStart);
        el.addEventListener('dragover', onDragOver);
        el.addEventListener('dragleave', onDragLeave);
        el.addEventListener('drop', onDrop);

        const header = document.createElement('div');
        header.className = 'cell-header d-flex align-items-center gap-2 controls';

        const drag = document.createElement('span');
        drag.className = 'drag-handle controls';
        drag.textContent = '⋮⋮';

        const badge = document.createElement('span');
        badge.className = 'badge bg-light text-dark controls';
        badge.textContent = cell.type.toUpperCase();

        const centerBtn = document.createElement('button');
        centerBtn.className = 'btn btn-outline-secondary btn-sm controls mb-2';
        centerBtn.textContent = `Alinear`;
        centerBtn.addEventListener('click', () => {
            const i = doc.findIndex(c => c.id === cell.id);
            const order = ['left', 'center', 'right'];
            const cur = doc[i].data.align || 'left';
            const next = order[(order.indexOf(cur) + 1) % order.length];
            doc[i].data.align = next;
            renderNotebook(notebook);

        })

        const deleteElement = document.createElement('button');
        deleteElement.className = 'btn btn-outline-danger btn-sm ms-auto controls';
        deleteElement.textContent = 'Eliminar';
        deleteElement.onclick = () => {
            const i = doc.findIndex(c => c.id === cell.id);
            if (i >= 0) { doc.splice(i, 1); renderNotebook(notebook); }
        };

        header.append(drag, badge, centerBtn, deleteElement);

        const body = document.createElement('div');
        const tag = document.createElement(cell.type);

        if (cell.type === 'table') {
            const title = document.createElement('h6');
            title.textContent = cell.data.title || 'Tabla';
            title.className = 'mb-2';
            body.appendChild(title);

            const table = document.createElement('table');
            table.className = 'table table-sm table-bordered align-middle';

            const thead = document.createElement('thead');
            const thr = document.createElement('tr');
            (cell.data.columns || []).forEach(col => {
                const th = document.createElement('th');
                th.textContent = col;
                thr.appendChild(th);
            });
            thead.appendChild(thr);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            (cell.data.rows || []).forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(val => {
                    const td = document.createElement('td');
                    td.textContent = val;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            body.appendChild(table);
        } else {
            tag.style.textAlign = (cell.data.align || 'left');


            tag.contentEditable = 'true';
            tag.innerText = cell.data.text || '';
            tag.addEventListener('input', () => { cell.data.text = tag.innerText; });
        }

        body.appendChild(tag);
        el.append(header, body);
        notebook.appendChild(el);
    });
}
export function addCellByNumber(numberLike, payload, notebook) {
    const number = parseInt(String(numberLike).trim(), 10);
    const type = typeElements[number];
    if (!type) { Alerts.showToastCloseInfo('Selecciona una opción válida'); return; }

    if (type === 'table') {
        if (!payload || !payload.columns || !payload.rows) {
            Alerts.showToastCloseInfo('La tabla no tiene datos');
            return;
        }
        doc.push({ id: uid(), type: 'table', data: payload });
    } else {
        doc.push({ id: uid(), type, data: { text: String(payload || ''), align: 'left' } });
    }

    renderNotebook(notebook);
}

export function validateValues(startStr, endStr, resourceValue) {
    if (!startStr || !endStr) return false;
    if (!resourceValue || resourceValue === "" || resourceValue === "selecionado") return false;
    return true;
}
export function validateValuesToImport(startStr, endStr) {
    if (!startStr || !endStr) return false;
    return true;
}

export function loadResourcesTable(table, item) {
    table.innerHTML += `
    <tr>
      <td>${item.nameR}</td>
      <td>
        <button class="btn btn-sm btn-danger btn-delete-resourceReport" data-id="${item.nameR}"><i class="bi bi-trash-fill"></i></button>
      </td>
    </tr>`;
}

export async function loadTable(resource, init, end, container) {
    const data = await getAllConsumptionsByFiltersMonth(resource, init, end);
    if (data.length === 0) {
        container.innerHTML = "<p>No hay datos que coincidan con los filtros seleccionados</p>"
        return
    }
    console.log(data)
    container.innerHtml = "";
    container.innerHTML = `
    <div class="table-responsive">
        <table id ="TableToExport" class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Recurso</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Costo</th>
            </tr>
          </thead>
          <tbody>
            ${data
            .map(
                (c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${c.resourcePurityName}</td>
                <td>${c.quantity}</td>
                <td>${c.consumptionDate.split(" ")[0]}</td>
                <td>$${c.cost}</td>
              </tr>`
            )
            .join("")}
          </tbody>
        </table>
    </div>`;
}


function onDragStart(e) {
    dragId = e.currentTarget.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
}
function onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}
function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}
function onDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const dropId = e.currentTarget.dataset.id;
    if (!dragId || dragId === dropId) return;

    const from = doc.findIndex(c => c.id === dragId);
    const to = doc.findIndex(c => c.id === dropId);
    const [moved] = doc.splice(from, 1);
    doc.splice(to, 0, moved);
    dragId = null;

    renderNotebook(document.getElementById('notebook'));
}

