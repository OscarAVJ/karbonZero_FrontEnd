function renderTabs(tabsData) {
  const tabList = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');

  tabList.innerHTML = '';
  tabContent.innerHTML = '';

  tabsData.forEach((tab, index) => {
    const isActive = index === 0;

    ///Creación de tabs
    const tabItem = document.createElement('li');
    tabItem.className = 'nav-item';
    tabItem.innerHTML = `
      <a class="nav-link ${isActive ? 'tab-active' : 'tab-inactive'}" data-bs-toggle="tab" href="#${tab.id}">${tab.name}</a>
    `;
    tabList.appendChild(tabItem);

    ///Crear contenido de cada tab
    const tabPane = document.createElement('div');
    tabPane.className = `tab-pane fade ${isActive ? 'show active' : ''}`;
    tabPane.id = tab.id;
    tabPane.innerHTML = `
      <div class="table-container table-responsive">
        <table class="table table-hover mb-0">
          <thead class="theadPosition">
            <tr>
              <th class="th_header">ID</th>
              <th class="th_header">Cantidad</th>
              <th class="th_header">Fecha de consumo</th>
              <th class="th_header">Costo total</th>
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

    ///Inicializar paginación
    setupPagination(tab.id, tab.data);
  });

  ///Agregar evento para cambiar colores dinámicamente
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
        <td>${item.cantidad}</td>
        <td>${item.fecha}</td>
        <td>${item.costo}</td>
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



function initConsumptions() {
  // Datos de ejemplo
  const tabsData = [
    {
      id: '1',
      name: 'Agua',
      data: Array.from({ length: 23 }, (_, i) => ({
        id: i + 1,
        cantidad: `${100 + i * 10}L`,
        fecha: `2024-01-${(i % 30 + 1).toString().padStart(2, '0')}`,
        costo: `$${10 + i}`
      }))
    },
    {
      id: '2',
      name: 'Luz',
      data: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        cantidad: `${200 + i * 20}kWh`,
        fecha: `2024-02-${(i % 28 + 1).toString().padStart(2, '0')}`,
        costo: `$${20 + i}`
      }))
    },
    {
      id: '3',
      name: 'Gasolina',
      data: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        cantidad: `${20 + i * 2}L`,
        fecha: `2024-03-${(i % 31 + 1).toString().padStart(2, '0')}`,
        costo: `$${30 + i}`
      }))
    },
    {
      id: '4',
      name: 'Gasolina',
      data: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        cantidad: `${20 + i * 2}L`,
        fecha: `2024-03-${(i % 31 + 1).toString().padStart(2, '0')}`,
        costo: `$${30 + i}`
      }))
    }
  ];

  renderTabs(tabsData);

  function renderTabs(tabsData) {
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');
    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
      const tabItem = document.createElement('li');
      tabItem.className = 'nav-item';
      tabItem.innerHTML = `
                <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">${tab.name}</a>
            `;
      tabList.appendChild(tabItem);

      // Tab content
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
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <span>Items por página</span>
                        <select class="form-select d-inline w-auto itemsPerPage ms-2">
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

      setupPagination(tabPane, tab.data);
    });
  }

  function setupPagination(tabPane, data) {
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
                    <td>${item.cantidad}</td>
                    <td>${item.fecha}</td>
                    <td>${item.costo}</td>
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
        const list = document.createElement('list');
        list.className = `page-item${i === currentPage ? ' active' : ''}`;
        list.innerHTML = `<button class="page-link">${i}</button>`;
        list.querySelector('button').addEventListener('click', () => {
          renderTablePage(i);
          renderPagination();
        });
        pagination.appendChild(list);
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
}
