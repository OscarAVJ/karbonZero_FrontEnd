import * as Alerts from '../../utils/alerts.js'
import { getAllConsumptionsByFiltersMonth } from '../services/consumptionService.js';

///Nuestro doc sirve para poder guardar todos los elementos y posteriormente mostrarlos en el "cuaderno" notebook
const doc = [];

///Aca definimos nuestros elementos
const typeElements = {
    1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6',
    7: 'p', 10: 'table'
};


///Esta funcion lo que hace es generar un codigo para nuestros elementos que se guardaran en el doc
const uid = () => Math.random().toString(36).slice(2, 9);

///Aca es donde manejaremos el id de el elemento que se va a mover
let dragId = null;

///Esta es la funcion para llenar selects
export async function loadResouceSelect(data, container) {
    data.forEach(element => {
        container.innerHTML += `
        <option value="${element.name}">${element.name}</option>
        `
    })
}

///Aca exportamos la data
export async function exportToExcel(initData, lastData, resourceSelected, resources) {
   
    ///Validamos valores
    if (!validateValues(initData.value, lastData.value, resourceSelected.value)) {
        Alerts.showToastCloseInfo("Favor seleccionar el filtro de fechas y el nombre del recurso");
        return;
    }

    ///Creamos un arreglo de nombres de recursos sin duplicados
    const resourceNames = [
        ///El ... es el operador spread: convierte el Set en un arreglo común
        ...new Set(
            ///Si resources es null o en su peor caso undefined,  usamos un arreglo vacio para evitar errores
            (resources || [])
                ///Mapeamos cada recurso para obtener el nombre(esto esta definido en el load)
                .map(r => r.nameR)
        )
    ];

    ///Aca validamos que exista al menos un elemento 
    if (resourceNames.length === 0) {
        Alerts.showToastCloseInfo("Selecciona al menos un recurso.");
        return;
    }

    ///Aca creamos nuestra hoja de excel
    const wb = new ExcelJS.Workbook();

    ///Por cada nombre que este en nuestro resourceNames vamos a iterarlo y por cada uno de esto se creara una nueva hoja o Tab,
    ///como a uds les salga mas facil comprender
    for (const resName of resourceNames) {
        ///Hacemos la peticion con ese nombre
        ///Ejemplo [agua, diesel, xxxx,xxxx]
        ///Iterara 4 veces creando un tab con cada uno de esos y ese nombre sera el que se enviara como param de resName
        let resp;
        try {
            resp = await getAllConsumptionsByFiltersMonth(resName, initData.value, lastData.value);
        } catch (e) {
            continue;
        }

        ///Accedemos a lo que se devuelve
        const data = resp

        ///Aca es donde se crean esos nuesvos tabs, siempre dentro del WorkBook
        const ws = wb.addWorksheet(resName);


        ///Definimos las columnas
        ws.columns = [
            { header: '#', key: 'idx', width: 6 },
            { header: 'Recurso', key: 'recurso', width: 20 },
            { header: 'Usuario', key: 'usuario', width: 18 },
            { header: 'Cantidad', key: 'cantidad', width: 12 },
            { header: 'Fecha', key: 'fecha', width: 14 },
            { header: 'Costo', key: 'costo', width: 12 },
        ];


        ///Esto de aca es para ponerle color a los headers, por eso obtenemos la primer columna
        const headerRow = ws.getRow(1);

        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF008000' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        ///Aca llenamos esas columnas, por cada c(consumo) y su i que es el inidice que se muestra puesto que usamos Raw no mandamos el id
        data.forEach((c, i) => {
            const raw = (c.consumptionDate ?? "").split(" ")[0];
            ///Le damos formato iso
            const iso = raw.includes("/") ? raw.split("/").reverse().join("-") : raw;
            const d = new Date(iso);
            const fechaCell = Number.isNaN(d.getTime()) ? raw : d;
            ///Aca las agregamos
            ws.addRow({
                idx: i + 1,
                recurso: c.resourcePurityName ?? resName,
                usuario: c.userName ?? "",
                cantidad: Number(c.quantity ?? 0),
                fecha: fechaCell,
                costo: Number(c.cost ?? 0),
            });
        });

        ///Damos formato para que esta cosa de excel no lanze el error ese que esta cosa esa corrupta
        ws.getColumn('cantidad').numFmt = '0';
        ws.getColumn('costo').numFmt = '0.00';
        ws.getColumn('fecha').numFmt = 'dd/m/yyyy';

        ///Y bueno, aca le damos un poco de estilo de zebra
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
    ///Generamos un ArrayBuffer con el contenido del workbook en formato XLSX
    const buffer = await wb.xlsx.writeBuffer();

    ///Creamos un Blob a partir del buffer.
    ///Un Blob es un "Binary Large Object", básicamente un contenedor de datos binarios.
    ///En este caso le decimos que el tipo MIME es de Excel (.xlsx)
    const blob = new Blob(
        [buffer],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    ///Creamos dinámicamente un enlace <a> para forzar la descarga del archivo
    const link = document.createElement('a');

    ///Convertimos el Blob en una URL temporal que el navegador pueda descargar
    link.href = URL.createObjectURL(blob);

    ///Le damos un nombre al archivo que se descargará (incluye fechas)
    link.download = `RegistroDeConsumo_${initData.value}_a_${lastData.value}.xlsx`;

    ///Agregamos el enlace temporal al DOM para poder simular el click
    document.body.appendChild(link);

    ///Disparamos el click programáticamente para iniciar la descarga
    link.click();

    ///Removemos el enlace del DOM porque ya no es necesario
    link.remove();

}



///Ahora va el export a PDF
export function exportToPdf(notebookEl) {
    ///Hacemos un d-none a todos los controles para que solo se queden los elementos
    document.querySelectorAll('.controls').forEach(el => el.style.display = 'none');
    if (notebookEl.length === 0) {
        Alerts.showToastCloseInfo("Agrega al menos un elemento.");
        return;
    }
    ///Definimos como sera nuestro pdf
    const file = {
        margin: [20, 16, 20, 16],
        filename: `karbonzero-report${uid()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.cell-header', 'tr'] }
    };

    ///Lllamamos a la libreria y le pasamos todo, al final ya volvemos a mostrar los controles
    html2pdf()
        .set(file)
        .from(notebookEl)
        .save()
        .then(() => {
            document.querySelectorAll('.controls').forEach(el => el.style.display = '');
        });
}
///Esto es para pasarle el BLOB a el word
function downloadBlob(blob, filename) {
    ///Cremos un a
    const a = document.createElement('a');
    ///le pasamos un blob con href
    a.href = URL.createObjectURL(blob);
    ///le ponemos que descargue el file
    a.download = filename;
    ///Le metemos el a al body
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
}

///Ahora el export a Word
export function exportToWord(notebookEl) {
    ///Verificar los elementos
    if (!notebookEl || (notebookEl.length === 0)) {
        Alerts.showToastCloseInfo("Agrega al menos un elemento.");
        return;
    }
    ///Aca van los controles a ocultar
    const hidden = [];
    document.querySelectorAll('.controls').forEach(el => {
        hidden.push([el, el.style.display]);
        el.style.display = 'none';
    });

    ///Copiamos el notebook que es el que pasamos al word al final
    const clone = notebookEl.cloneNode(true);

    ///Aca definimos estilo de nuesto doc
    const wordCss = `
    @page { size: A4; margin: 1.5cm; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #111; }
    h1,h2,h3 { margin: 0.4em 0 0.2em; }
    .cell-header { page-break-inside: avoid; }
    .page-break { page-break-after: always; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #999; padding: 4pt; vertical-align: top; }
  `;

  ///Le ponemos el header puesto que esto requeriere el doc de html completo
    const header =
        `<!DOCTYPE html>
     <html xmlns:o="urn:schemas-microsoft-com:office:office"
           xmlns:w="urn:schemas-microsoft-com:office:word"
           xmlns="http://www.w3.org/TR/REC-html40">
       <head>
         <meta charset="utf-8" />
         <title>KarbonZero Report</title>
         <style>${wordCss}</style>
         <!--[if gte mso 9]><xml>
           <w:WordDocument>
             <w:View>Print</w:View>
             <w:Zoom>100</w:Zoom>
             <w:DoNotOptimizeForBrowser/>
           </w:WordDocument>
         </xml><![endif]-->
       </head>
       <body>`;
    ///Le creamos un footer para cerrar
    const footer = `</body></html>`;

    ///Y aca es como le pasaremos full el html
    const html = header + clone.innerHTML + footer;

    ///Creamos el blob para pasarlo al downloadBlob
    const blob = new Blob(
        ['\ufeff', html],
        { type: 'application/msword;charset=utf-8' }
    );
    ///Definimos el nombre que tendra el file
    const filename = `karbonzero-report-${Date.now()}.doc`;
    ///Llamamos al blob
    downloadBlob(blob, filename);

    ///Volvemos a mostrar los controles
    hidden.forEach(([el, val]) => (el.style.display = val));
}
export function renderNotebook(notebook) {
    ///Esto es lo que sale cuando el doc esta vacio
    if (doc.length === 0) {
        notebook.innerHTML = `
        <section id="firstLoadNotebook" class="d-flex align-items-center max-vh-100 py-5">
            <div class="container py-5">
                <div class="row align-items-center d-flex justify-content-between">
                    <div class="col-md-6 order-md-2">
                        <div class="lc-block">
                            <img class="img-fluid" src="https://res.cloudinary.com/dtxerr5sz/image/upload/v1760319434/bhv5jli2xoo91tirjetc.png"></img>
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
    } else {
        notebook.innerHTML = ''
    }
    ///Aca por cada celda, osea por cada objeto de nuestro notebook
    doc.forEach((cell) => {
        ///Creamos el contenedor de cada elemento
        const el = document.createElement('div');
        ///Le agregamos unas propiedades
        el.className = 'cell';
        el.draggable = true;
        el.dataset.id = cell.id;

        ///Le asignamos los eventos posibles de drag and drop
        el.addEventListener('dragstart', onDragStart);
        el.addEventListener('dragover', onDragOver);
        el.addEventListener('dragleave', onDragLeave);
        el.addEventListener('drop', onDrop);


        ///Creamos el header del elemento
        const header = document.createElement('div');
        header.className = 'cell-header d-flex align-items-center gap-2 controls';

        ///Icono del drag
        const drag = document.createElement('span');
        drag.className = 'drag-handle controls';
        drag.textContent = '⋮⋮';

        ///El span con el tipo de elemento
        const badge = document.createElement('span');
        badge.className = 'badge bg-light text-dark controls';
        badge.textContent = cell.type.toUpperCase();

        ///El boton de centrar
        const centerBtn = document.createElement('button');
        centerBtn.className = 'btn btn-outline-secondary btn-sm controls mb-2';
        centerBtn.textContent = `Alinear`;

        ///Aca que hace al centrar
        centerBtn.addEventListener('click', () => {
            ///Encontramos al elemento con x id
            const i = doc.findIndex(c => c.id === cell.id);
            ///Las posibilidades a ordenar
            const order = ['left', 'center', 'right'];
            ///Obtenemos el actual o por defecto left
            const cur = doc[i].data.align || 'left';
            ///El next que ya va en base al orden
            const next = order[(order.indexOf(cur) + 1) % order.length];
            ///Y aca ya le pasamos el align
            doc[i].data.align = next;
            renderNotebook(notebook);

        })

        ///Delete element control
        const deleteElement = document.createElement('button');
        deleteElement.className = 'btn btn-outline-danger btn-sm ms-auto controls';
        deleteElement.textContent = 'Eliminar';
        ///Al darle click busca el indice y le hace splice al doc, splice pide 2 param uno es el id y el otro la cantidad de elementos a eliminar, al final renderNotebbook
        deleteElement.onclick = () => {
            const i = doc.findIndex(c => c.id === cell.id);
            if (i >= 0) { doc.splice(i, 1); renderNotebook(notebook); }
        };

        ///Aca le metemos la todos los elementos creados al header
        header.append(drag, badge, centerBtn, deleteElement);

        ///Creamos el div del body de nuesto elemento
        const body = document.createElement('div');
        const tag = document.createElement(cell.type);

        ///Si es tipo tabla le damos formato, creamos el title, thead y todo lo normal de una tabla con sus th
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

            ///En el tbody iteramos y pues le pasamos el valor de cada row
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
            ///Caso de que sean los textos h1-h6 y p unicamente les pasamos eso y les ponemos contentEditable para que pues se pueda editar, esto ya es nativo de html
            tag.style.textAlign = (cell.data.align || 'left');
            ///Hace que el contenido se pueda editar
            tag.contentEditable = 'true';
            tag.innerText = cell.data.text || '';
            tag.addEventListener('input', () => { cell.data.text = tag.innerText; });
        }

        ///Al body le metemos el tag y a el elemento el header y body
        body.appendChild(tag);
        el.append(header, body);
        ///Al notebook le metemos el elemento
        notebook.appendChild(el);
    });
}

///Vaya, esta funcion es mega importante, puesto que aca es donde se agregan los elementos
export function addCellByNumber(numberLike, payload, notebook) {
    ///El number que nos trae el cual es el dataset de nuestros elementos, definidos en typeElements
    const number = parseInt(String(numberLike).trim(), 10);
    ///Aca se guarda el type en base al number
    const type = typeElements[number];

    ///Aca hay un if para verificar las tablas y los demas textos
    if (type === 'table') {
        ///Mandamos el tipo tabla con sus datos a cargar
        doc.push({ id: uid(), type: 'table', data: payload });
    } else {
        ///Mandamos el texto con sus datos y un align left como inical
        doc.push({ id: uid(), type, data: { text: String(payload || ''), align: 'left' } });
    }

    renderNotebook(notebook);
}
///Validamos los campos
export function validateValues(startStr, endStr) {
    if (!startStr || !endStr) return false;
    return true;
}
///Validamos los campos
export function validateValuesToImport(startStr, endStr) {
    if (!startStr || !endStr) return false;
    return true;
}

///Este es el load de la tabla que sale en el offcanvas de generar excel
export function loadResourcesTable(table, item) {
    table.innerHTML += `
    <tr>
      <td>${item.nameR}</td>
    </tr>`;
}

///Este es el load de se muestra en los preview btn
export async function loadTable(resource, init, end, container) {
    ///Hace el get
    const data = await getAllConsumptionsByFiltersMonth(resource, init, end);
    ///Valida
    if (data.length === 0) {
        container.innerHTML = "<p>No hay datos que coincidan con los filtros seleccionados</p>"
        return
    }
    console.table(data)
    ///Lo de siempre
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


///Aca manejamos los eventos de drag and drop
///Cuando inicia
function onDragStart(e) {
    dragId = e.currentTarget.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
}
///Cuando se agarra
function onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}
///Cuando se suelta
function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}
///Ya puesto
function onDrop(e) {
    e.preventDefault();
    ///removemos la clase visual que indicaba el area de drop
    e.currentTarget.classList.remove('drag-over');
    ///obtenemos el id del elemento sobre el que se soltó 
    const dropId = e.currentTarget.dataset.id;

    ///Si no se cambia return
    if (!dragId || dragId === dropId) return;

    ///Buscamos el indice de donde se esta arrastrando el que se va a agarrar
    const from = doc.findIndex(c => c.id === dragId);
    ///Buscamos el indice de destino, osea donde se va a soltar
    const to = doc.findIndex(c => c.id === dropId);

    ///quitamos el elemento del arreglo y lo guardamos en moved
    const [moved] = doc.splice(from, 1);

    ///Insertamos ele elemento en esa posicion
    doc.splice(to, 0, moved);

    dragId = null;

    ///Renderizamos nuestro noteBook
    renderNotebook(document.getElementById('notebook'));
}


