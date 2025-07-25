export async function render() {
    return `
<!-- Consumptions Section -->
<div class=" py-4">
    <h2 class="general-title">
        Recursos
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <div class="dropdown">
                <button class="btn btn-light d-flex align-items-center gap-2 border rounded-3 px-3" type="button"
                    id="dropdownMes" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-calendar"></i> Mes
                    <i class="bi bi-chevron-down"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMes">
                    <li><a class="dropdown-item" href="#">Enero</a></li>
                    <li><a class="dropdown-item" href="#">Febrero</a></li>
                    <li><a class="dropdown-item" href="#">Marzo</a></li>
                </ul>
            </div>
            <div class="dropdown">
                <button class="btn btn-light d-flex align-items-center gap-2 border rounded-3 px-3" type="button"
                    id="dropdownTrimestre" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-calendar"></i> Trimestre
                    <i class="bi bi-chevron-down"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownTrimestre">
                    <li><a class="dropdown-item" href="#">Q1</a></li>
                    <li><a class="dropdown-item" href="#">Q2</a></li>
                    <li><a class="dropdown-item" href="#">Q3</a></li>
                </ul>
            </div>
            <button class="kz-button-create" id="button-kz">

            </button>
        </div>
    </div>
    <!--!MODAL RECURSOS -->
    <div class="modal fade" id="recursosModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Recursos</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3 ">
                            <label for="unidadtxt" class="form-label">Unidad de medida</label>
                            <select id="unidadtxt" class="form-select">
                                <option>Metro3</option>
                                <option>Litros</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="nombreRtxt" class="form-label">Nombre</label>
                            <input id="nombreRtxt" type="text" class="form-control" placeholder="Nombre">
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="huellaRtxt" class="form-label">Huella de carbono</label>
                            <input id="huellaRtxt" type="number" class="form-control" placeholder="Huella de carbono">
                        </div>
                        <div class="row g-2 mb-3">
                            <label for=""></label>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!--! MODAL PUREZA -->
    <div class="modal fade" id="purezaModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Pureza</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3 ">
                            <label for="recursoPtxt" class="form-label">Recurso</label>
                            <select id="recursoPtxt" class="form-select">
                                <option>Agua</option>
                                <option>Electricidad</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="purezaPtxt" class="form-label">Pureza</label>
                            <input id="purezaPtxt" type="number" class="form-control" placeholder="Pureza">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!--! MODAL MEDIDAS -->
    <div class="modal fade" id="medidasModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Medidas</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <label for="nombreMEtxt" class="form-label">Medida</label>
                            <input id="nombreMEtxt" type="text" class="form-control" placeholder="Nombre">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="unidadesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Unidad de medida</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <label for="medidasUtxt" class="form-label">Medida</label>
                            <select id="medidasUtxt" class="form-select">
                                <option>Energia</option>
                                <option>Masa</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="nombreUtxt" class="form-label">Unidad</label>
                            <input id="nombreUtxt" type="text" class="form-control" placeholder="Nombre">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="conversionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Conversión de unidades</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-2">
                            <label for="medidasCtxt" class="form-label">Medidas</label>
                            <select id="medidasCtxt" class="form-select">
                                <option>Masa</option>
                                <option>Volumen</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-2">
                            <label for="recursoCtxt" class="form-label">Recurso</label>
                            <select id="recursoCtxt" class="form-select">
                                <option>Agua</option>
                                <option>Luz</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label for="unidadItxt" class="form-label">Unidad inicial</label>
                                <select id="unidadItxt" class="form-select">
                                    <option>Litros</option>
                                    <option>Gramos</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="unidadFtxt" class="form-label">Unidad final</label>
                                <select id="unidadFtxt" class="form-select">
                                    <option>Mililitros</option>
                                    <option>Miligramos</option>
                                </select>
                            </div>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label for="operacionCtxt" class="form-label">Operación</label>
                                <select id="operacionCtxt" class="form-select">
                                    <option>Suma</option>
                                    <option>Multiplicación</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="constanteCtxt" class="form-label">Constante</label>
                                <input id="constanteCtxt" type="number" class="form-control" placeholder="Constante">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent"></div>
</div>      

  `;
}

export function afterRender() {
    initResources();
}

function initResources() {
    const kzButton = document.getElementById('button-kz');
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');

    if (!kzButton || !tabList || !tabContent) {
        console.warn('Elementos no encontrados: asegúrate que el HTML se cargó correctamente.');
        return;
    }

    const modalMap = {
        recursos: 'recursosModal',
        pureza: 'purezaModal',
        medidas: 'medidasModal',
        unidades: 'unidadesModal',
        conversion: 'conversionModal'
    };

    const tabsData = [
        {
            id: 'recursos',
            name: 'Recursos',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Nombre', field: 'nombre' },
                { label: 'Unidad de medida', field: 'unidad_medida' },
                { label: 'Huella de carbono', field: 'huella_carbono' },
                { label: 'Pureza', field: 'pureza' }
            ],
            data: [
                { id: 1, nombre: 'Agua', unidad_medida: 'Litros', huella_carbono: '0.5 kg CO₂', pureza: '99 %' },
                { id: 2, nombre: 'Gasolina', unidad_medida: 'Litros', huella_carbono: '2.3 kg CO₂', pureza: '95 %' }
            ]
        },
        {
            id: 'pureza',
            name: 'Pureza',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Nombre', field: 'nombre' },
                { label: 'Pureza', field: 'pureza' }
            ],
            data: [
                { id: 1, nombre: 'Agua', pureza: '99 %' },
                { id: 2, nombre: 'Gasolina', pureza: '95 %' }
            ]
        },
        {
            id: 'medidas',
            name: 'Medidas',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Nombre', field: 'nombre' },
            ],
            data: [
                { id: 1, nombre: 'Agua', },
                { id: 2, nombre: 'Gasolina' }
            ]
        },
        {
            id: 'unidades',
            name: 'Unidades de medida',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Medida', field: 'medida' },
                { label: 'Unidad de medida', field: 'unidad_medida' }
            ],
            data: [
                { id: 1, medida: 'Volumen', unidad_medida: 'Litros' },
                { id: 2, medida: 'Masa', unidad_medida: 'Kilogramos' }
            ]
        },
        {
            id: 'conversion',
            name: 'Conversión de unidades',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Unidad inicial', field: 'unidad_inicial' },
                { label: 'Unidad final', field: 'unidad_final' },
                { label: 'Recurso', field: 'recurso' },
                { label: 'Operación', field: 'operacion' },
                { label: 'Constante', field: 'constante' }
            ],
            data: [
                {
                    id: 1,
                    unidad_inicial: 'Litros',
                    unidad_final: 'Mililitros',
                    recurso: 'Agua',
                    operacion: 'Multiplicar',
                    constante: '1000'
                },
                {
                    id: 2,
                    unidad_inicial: 'Kilogramos',
                    unidad_final: 'Gramos',
                    recurso: 'Papel',
                    operacion: 'Multiplicar',
                    constante: '1000'
                }
            ]
        }
    ];

    renderTabs(tabsData, kzButton, tabList, tabContent, modalMap);
}
function renderTabs(tabsData, kzButton, tabList, tabContent, modalMap) {
    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
        const tabItem = document.createElement('li');
        tabItem.className = 'nav-item';
        tabItem.innerHTML = `
      <a class="nav-link ${idx === 0 ? 'active' : ''}"
         data-bs-toggle="tab"
         href="#${tab.id}">${tab.name}</a>`;
        tabList.appendChild(tabItem);

        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade${idx === 0 ? ' show active' : ''}`;
        tabPane.id = tab.id;
        tabPane.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              ${tab.columns.map(c => `<th>${c.label}</th>`).join('')}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="mt-2">
        <nav class="d-flex justify-content-center">
          <ul class="pagination mb-0"></ul>
        </nav>
      </div>`;
        tabContent.appendChild(tabPane);

        setupPagination(tabPane, tab.data, tab.columns, tab.id, modalMap);
    });

    kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${tabsData[0].name}`;
    kzButton.setAttribute('type', 'button');
    kzButton.setAttribute('data-bs-toggle', 'modal');
    kzButton.setAttribute('data-bs-target', `#${modalMap[tabsData[0].id]}`);

    tabList.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            const active = tabsData.find(t => `#${t.id}` === href);
            if (active) {
                kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${active.name}`;
                kzButton.setAttribute('data-bs-target', `#${modalMap[active.id]}`);
            }
        });
    });
}

function setupPagination(tabPane, data, columns, name,modalMap) {
    const tbody = tabPane.querySelector('tbody');
    const pagination = tabPane.querySelector('.pagination');
    let currentPage = 1;
    const perPage = 10;

    function renderPage(page) {
        currentPage = page;
        const start = (page - 1) * perPage;
        const slice = data.slice(start, start + perPage);

        tbody.innerHTML = slice.map(item => `
        <tr>
          ${columns.map(c => `<td>${item[c.field] || ''}</td>`).join('')}
          <td>
            <button class="btn btn-sm btn-success me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#${modalMap[name]}">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
          </td>
        </tr>`).join('');
    }

    function renderPagination() {
        const totalPages = Math.ceil(data.length / perPage) || 1;
        const info = `<div class="text-muted">Mostrando ${(currentPage - 1) * perPage + 1}-${Math.min(currentPage * perPage, data.length)} de ${data.length}</div>`;
        const ul = document.createElement('ul');
        ul.className = 'pagination mb-0';

        function addBtn(label, page, disabled, active) {
            const li = document.createElement('li');
            li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
            li.innerHTML = `<button class="page-link" ${disabled ? 'tabindex="-1"' : ''}>${label}</button>`;
            if (!disabled && !active) li.firstChild.addEventListener('click', () => { renderPage(page); renderPagination(); });
            ul.appendChild(li);
        }

        pagination.innerHTML = '';
        addBtn('«', currentPage - 1, currentPage === 1);
        for (let p = 1; p <= totalPages; p++) addBtn(p, p, false, p === currentPage);
        addBtn('»', currentPage + 1, currentPage === totalPages);

        pagination.insertAdjacentHTML('afterbegin', info);
        pagination.appendChild(ul);
    }

    renderPage(currentPage);
    renderPagination();
}