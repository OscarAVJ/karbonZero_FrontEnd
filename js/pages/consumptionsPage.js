export async function render() {
    return `
    <!-- Consumptions Section -->
    <div class="py-4">
      <h2 class="general-title">Consumos</h2>

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
          <button type="button" class="kz-button-create" data-bs-toggle="modal" data-bs-target="#comsumptionsFormModal">
            <i class="bi bi-plus-circle"></i> Crear consumo
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="comsumptionsFormModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content kz-modal-mongo border-0">
            <div class="modal-header" style="justify-content: center; position: relative;">
              <h4 class="kz-modal-title" id="exampleModalLongTitle">Consumos</h4>
              <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="consumptionsForm">
              <div class="modal-body mx-3">
                <div class="row g-2 mb-2">
                  <label for="recursotxt" class="form-label">Recurso</label>
                  <select id="recursotxt" class="form-select">
                    <option>Electricidad</option>
                    <option>Agua</option>
                  </select>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-sm-3">
                    <label for="purezatxt" class="form-label">Pureza</label>
                    <input id="purezatxt" type="number" class="form-control" placeholder="Pureza">
                  </div>
                  <div class="col-sm-6">
                    <label for="unidadtxt" class="form-label">Unidad de medida</label>
                    <input id="unidadtxt" type="text" class="form-control" placeholder="Unidad de medida">
                  </div>
                  <div class="col-sm-3">
                    <label for="cantidadtxt" class="form-label">Cantidad</label>
                    <input id="cantidadtxt" type="number" class="form-control" placeholder="Cantidad">
                  </div>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-sm-6">
                    <label for="costotxt" class="form-label">Costo</label>
                    <input type="number" id="costotxt" class="form-control" placeholder="Costo">
                  </div>
                  <div class="col-sm-6">
                    <label for="fecha" class="form-label">Fecha</label>
                    <input type="date" id="fecha" class="form-control">
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
    initConsumptions();  // Aquí puedes inicializar lógica como: listeners, fetch, validaciones, etc.
}


function initConsumptions() {
    const tabsData = [
        {
            id: 'agua',
            name: 'Agua',
            data: Array.from({ length: 23 }, (_, i) => ({
                id: i + 1,
                cantidad: `${100 + i * 10}L`,
                fecha: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`,
                costo: `$${10 + i}`
            }))
        },
        {
            id: 'luz',
            name: 'Luz',
            data: Array.from({ length: 12 }, (_, i) => ({
                id: i + 1,
                cantidad: `${200 + i * 20}kWh`,
                fecha: `2024-02-${String((i % 28) + 1).padStart(2, '0')}`,
                costo: `$${20 + i}`
            }))
        },
        {
            id: 'gasolina',
            name: 'Gasolina',
            data: Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                cantidad: `${20 + i * 2}L`,
                fecha: `2024-03-${String((i % 31) + 1).padStart(2, '0')}`,
                costo: `$${30 + i}`
            }))
        }
    ];
    ///Por que inicializamos un modal?, bueno pues es por que esta cosa al no estar creando en si un dialog con html si no con bootstrap, entonces tenemos que crear una instancia y luego verificar y aja, abajo esta el metodo
    initConsumptionModal();
    renderTabs(tabsData); const form = document.getElementById('consumptionsForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = document.getElementById('purezatxt').value;
            console.log(text);
            window.consumptionsModal.hide();
        });
    }
}

function initConsumptionModal() {
    const modalEl = document.getElementById('comsumptionsFormModal');
    if (!modalEl) return;
    /// si ya existía, getOrCreateInstance no crea una nueva
    window.consumptionsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
}


function renderTabs(tabsData) {
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');
    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
        /// Aca creamos los tabs
        const tabItem = document.createElement('li');
        tabItem.className = 'nav-item';
        tabItem.innerHTML = `
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">${tab.name}</a>
    `;
        tabList.appendChild(tabItem);

        /// Crear contenido del tab
        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade${idx === 0 ? ' show active' : ''}`;
        tabPane.id = tab.id;
        tabPane.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Cantidad</th>
              <th>Fecha de consumo</th>
              <th>Costo total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div>
        <nav style="display: flex; justify-content: center;">
          <ul class="pagination mb-0"></ul>
        </nav>
      </div>
    `;
        tabContent.appendChild(tabPane);

        createPagination(tabPane, tab.data);
    });
}

function createPagination(tabPane, data) {
    const tableBody = tabPane.querySelector('tbody');
    const pagination = tabPane.querySelector('.pagination');

    let currentPage = 1;
    const itemsPerPage = 10;

    function renderTablePage(page) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const paginatedItems = data.slice(start, start + itemsPerPage);

        tableBody.innerHTML = paginatedItems.map(item => `
      <tr>
        <td>${item.id}</td>
        <td>${item.cantidad}</td>
        <td>${item.fecha}</td>
        <td>${item.costo}</td>
        <td>
          <button class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#comsumptionsFormModal"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    `).join('');
    }

    function renderPagination() {
        const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, data.length);

        pagination.innerHTML = '';

        const controls = document.createElement('div');
        controls.className = 'pagination-controls d-flex justify-content-center align-items-center mt-3 w-100 gap-3';

        const info = document.createElement('div');
        info.className = 'pagination-info text-muted';
        info.textContent = `Mostrando ${start}-${end} de ${data.length}`;

        const nav = document.createElement('nav');
        const ul = document.createElement('ul');
        ul.className = 'pagination mb-0';

        /// Botón anterior
        const prevLi = document.createElement('li');
        prevLi.className = `page-item${currentPage === 1 ? ' disabled' : ''}`;
        prevLi.innerHTML = `<span class="page-link">&lt;</span>`;
        if (currentPage > 1) {
            prevLi.addEventListener('click', () => {
                renderTablePage(currentPage - 1);
                renderPagination();
            });
        }
        ul.appendChild(prevLi);

        /// Botones numerados
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item${i === currentPage ? ' active' : ''}`;
            li.innerHTML = `<button class="page-link">${i}</button>`;
            if (i !== currentPage) {
                li.querySelector('button').addEventListener('click', () => {
                    renderTablePage(i);
                    renderPagination();
                });
            }
            ul.appendChild(li);
        }

        /// Botón siguiente
        const nextLi = document.createElement('li');
        nextLi.className = `page-item${currentPage === totalPages ? ' disabled' : ''}`;
        nextLi.innerHTML = `<span class="page-link">&gt;</span>`;
        if (currentPage < totalPages) {
            nextLi.addEventListener('click', () => {
                renderTablePage(currentPage + 1);
                renderPagination();
            });
        }
        ul.appendChild(nextLi);

        nav.appendChild(ul);
        controls.appendChild(info);
        controls.appendChild(nav);
        pagination.appendChild(controls);
    }

    renderTablePage(currentPage);
    renderPagination();
}

// ///Algo mal tenia que tener bootstrap :(, se hace asi puesto que no creamos un modal como tal entonces tenemos que crear un objeto de bootstrap
// //TODO: Solucionar el maldito erro de que no se elimina esta instancia "Creo que es eso"
// document.getElementById('consumptionsForm').addEventListener('submit', function (e) {
//   e.preventDefault();
//   // TODO: enviar datos al servidor
//   modal.hide();
// });
