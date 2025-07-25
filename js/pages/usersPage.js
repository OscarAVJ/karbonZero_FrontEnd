export async function render() {
    return `
    <div class="py-4">
        <h2 class="general-title">
            Usuarios
        </h2>
        <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-wrap" style="background:#f5f5f5;">
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
                <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#usersModal">
                    <i class="bi bi-plus-circle"></i> Crear usuario
                </button>
            </div>
        </div>
        <div class="modal fade" id="usersModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content kz-modal-mongo border-0">
                    <div class="modal-header" style="justify-content: center; position: relative;">
                        <h4 class="kz-modal-title" id="exampleModalLongTitle">Usuarios</h4>
                        <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                            data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <form id="userForm">
                        <div class="modal-body mx-3">
                            <div class="row g-2 mb-3">
                                <div class="col-sm-6">
                                    <label for="nombretxt" class="form-label">Nombre</label>
                                    <input id="nombretxt" type="text" class="form-control" placeholder="Nombre">
                                </div>
                                <div class="col-sm-6">
                                    <label for="apellidotxt" class="form-label">Apellido</label>
                                    <input id="apellidotxt" type="text" class="form-control" placeholder="Apellido">
                                </div>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-sm-6">
                                    <label for="usuariotxt" class="form-label">Usuario</label>
                                    <input type="text" id="usuariotxt" class="form-control" placeholder="Usuario">
                                </div>
                                <div class="col-sm-6">
                                    <label for="correoElectronico" class="form-label">Correo electrónico</label>
                                    <input type="email" id="correoElectronico" class="form-control" placeholder="Correo">
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
    initUsers();
}

export function initUsers() {
    const usuarios = [
        {
            id: 1,
            nombre: "Juan Pérez",
            usuario: "jperez",
            correoElectronico: "juan.perez@mail.com"
        },
        {
            id: 2,
            nombre: "Ana López",
            usuario: "alopez",
            correoElectronico: "ana.lopez@mail.com"
        }
    ];

    const tabsData = [
        {
            id: 'usuarios',
            name: 'Usuarios',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Nombre', field: 'nombre' },
                { label: 'Usuario', field: 'usuario' },
                { label: 'Correo', field: 'correoElectronico' }
            ],
            data: usuarios
        }
    ];

    initUserModal();
    renderTabs(tabsData);
}

function initUserModal() {
    const modal = document.querySelector('#usersModal');
    if (!modal) return;

    window.userModal = bootstrap.Modal.getOrCreateInstance(modal);

    const form = document.getElementById('userForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.userModal.hide();
        });
    }
}
function renderTabs(tabsData) {
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');

    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
        // Crear pestaña (li > a)
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">
        ${tab.name}
      </a>
    `;
        tabList.appendChild(li);

        // Crear contenido de la pestaña
        const pane = document.createElement('div');
        pane.className = `tab-pane fade${idx === 0 ? ' show active' : ''}`;
        pane.id = tab.id;
        pane.innerHTML = `
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
        <nav class="d-flex justify-content-center mt-2">
          <ul class="pagination mb-0"></ul>
        </nav>
      </div>
    `;
        tabContent.appendChild(pane);

        setupPagination(pane, tab.data, tab.columns);
    });

}

function setupPagination(pane, data, columns) {
    const tbody = pane.querySelector('tbody');
    const pagination = pane.querySelector('.pagination');

    let currentPage = 1;
    let itemsPerPage = 10;

    function renderTablePage() {
        const start = (currentPage - 1) * itemsPerPage;
        const rows = data.slice(start, start + itemsPerPage);

        tbody.innerHTML = rows.map(r => `
      <tr>
        ${columns.map(c => `<td>${r[c.field] ?? ''}</td>`).join('')}
        <td>
          <button class="btn btn-sm btn-success me-1"><i class="bi bi-pencil-fill"></i></button>
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

        const info = document.createElement('span');
        info.className = 'text-muted me-3';
        info.textContent = `Mostrando ${start}-${end} de ${data.length}`;
        pagination.appendChild(info);

        const ul = document.createElement('ul');
        ul.className = 'pagination mb-0';
        pagination.appendChild(ul);

        const addBtn = (label, page, disabled = false, active = false) => {
            const li = document.createElement('li');
            li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
            li.innerHTML = `<button class="page-link">${label}</button>`;
            if (!disabled && !active) li.firstChild.addEventListener('click', () => {
                currentPage = page;
                renderTablePage();
                renderPagination();
            });
            ul.appendChild(li);
        };

        addBtn('«', currentPage - 1, currentPage === 1);
        for (let i = 1; i <= totalPages; i++) addBtn(i, i, false, i === currentPage);
        addBtn('»', currentPage + 1, currentPage === totalPages);
    }

    renderTablePage();
    renderPagination();
}
