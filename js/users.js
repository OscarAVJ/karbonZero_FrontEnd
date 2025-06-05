function renderTabs(tabsData) {
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');

    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, index) => {
        const isActive = index === 0;

        // Crear contenido de tab con paginación
        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade ${isActive ? 'show active' : ''}`;
        tabPane.id = tab.id;
        tabPane.innerHTML = `
      <div class="table-container table-responsive">
        <table class="table table-hover mb-0">
          <thead class="theadPosition">
            <tr>
              <th class="th_header">ID</th>
              <th class="th_header">Nombre</th>
              <th class="th_header">Usuario</th>
              <th class="th_header">Correo electronico</th>
              <th class="th_header">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="pagination-controls mt-3 d-flex justify-content-between align-items-center">
        <div>
          <span class="me-2">Items por página</span>
          <select class="form-select d-inline w-auto itemsPerPage">
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="15">15</option>
          </select>
        </div>
        <nav>
          <ul class="pagination mb-0"></ul>
        </nav>
      </div>
    `;
        tabContent.appendChild(tabPane);

        // Inicializar paginación
        setupPagination(tab.id, tab.data);
    });

    // Agregar evento para cambiar colores dinámicamente
    document.querySelectorAll('#tabList .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('#tabList .nav-link').forEach(l => {
                l.classList.remove('tab-active');
                l.classList.add('tab-inactive');
            });
            link.classList.remove('tab-inactive');
            link.classList.add('tab-active');
        });
    });
}

function setupPagination(tabId, data) {
    const tabPane = document.getElementById(tabId);
    const tableBody = tabPane.querySelector('tbody');
    const pagination = tabPane.querySelector('.pagination');
    const itemsPerPageSelect = tabPane.querySelector('.itemsPerPage');

    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageSelect.value);

    function renderTablePage(page) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const paginatedItems = data.slice(start, start + itemsPerPage);

        tableBody.innerHTML = paginatedItems.map(item => `
      <tr>
        <td>${item.id}</td>
        <td>${item.nombre}</td>
        <td>${item.usuario}</td>
        <td>${item.correoElectronico}</td>
        <td>
          <button class="btn btn-sm btn-success me-1"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    `).join('');
    }

    function renderPagination() {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<button class="page-link">${i}</button>`;
            li.querySelector('button').addEventListener('click', () => {
                renderTablePage(i);
                renderPagination();
            });
            pagination.appendChild(li);
        }
    }

    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        renderTablePage(1);
        renderPagination();
    });

    renderTablePage(currentPage);
    renderPagination();
}



function initUsers() {
    //!Ejemplo de uso cambio pronto
    const tabsData = [
        {
            id: '1',
            name: 'Agua',
            data: [
                { id: 1, nombre: '100L', usuario: '2024-01-01', correoElectronico: '$10' },
                { id: 2, nombre: '150L', usuario: '2024-01-02', correoElectronico: '$15' },
                { id: 3, nombre: '200L', usuario: '2024-01-03', correoElectronico: '$20' },
                { id: 4, nombre: '250L', usuario: '2024-01-04', correoElectronico: '$25' },
                { id: 5, nombre: '300L', usuario: '2024-01-05', correoElectronico: '$30' },
                { id: 6, nombre: '350L', usuario: '2024-01-06', correoElectronico: '$35' },
                { id: 7, nombre: '400L', usuario: '2024-01-07', correoElectronico: '$40' },
                { id: 8, nombre: '450L', usuario: '2024-01-08', correoElectronico: '$45' },
                { id: 9, nombre: '500L', usuario: '2024-01-09', correoElectronico: '$50' },
                { id: 10, nombre: '550L', usuario: '2024-01-10', correoElectronico: '$55' },
                { id: 11, nombre: '600L', usuario: '2024-01-11', correoElectronico: '$60' },
                { id: 1, nombre: '100L', usuario: '2024-01-01', correoElectronico: '$10' },
                { id: 2, nombre: '150L', usuario: '2024-01-02', correoElectronico: '$15' },
                { id: 3, nombre: '200L', usuario: '2024-01-03', correoElectronico: '$20' },
                { id: 4, nombre: '250L', usuario: '2024-01-04', correoElectronico: '$25' },
                { id: 5, nombre: '300L', usuario: '2024-01-05', correoElectronico: '$30' },
            ]
        },
    ];
    renderTabs(tabsData);
    console.log("Consumos esta siendo cargado jajajaja");
}
