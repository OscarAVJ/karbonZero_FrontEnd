function renderTabs(tabsData) {
  const tabList = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');
  const kzButton = document.getElementById('button-kz');
  tabList.innerHTML = '';
  tabContent.innerHTML = '';

  tabsData.forEach((tab, index) => {
    const isActive = index === 0;

    ///Creación de tabs
    const tabItem = document.createElement('li');
    tabItem.className = 'nav-item';
    tabItem.innerHTML = `
      <a class="nav-link ${isActive ? 'active tab-active' : 'tab-inactive'}" data-bs-toggle="tab" href="#${tab.id}">${tab.name}</a>
    `;
    tabList.appendChild(tabItem);

    ///Crear contenido de cada tab
    const tabPane = document.createElement('div');
    kzButton.innerHTML = `<i class="bi bi-plus-circle-fill"></i> Agregar recursos`;
    tabPane.className = `tab-pane fade ${isActive ? 'show active' : ''}`;
    tabPane.id = tab.id;
    tabPane.innerHTML = `
      <div class="table-container table-responsive">
        <table class="table table-hover mb-0">
          <thead class="theadPosition">
            <tr>
              ${tab.columns.map(col => `<th class="th_header">${col.label}</th>`).join('')}
              <th class="th_header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${tab.data.map(item => `
              <tr>
                ${tab.columns.map(col => `<td>${item[col.field] ?? ''}</td>`).join('')}
                <td>
                  <button class="btn btn-sm btn-success me-1"><i class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
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
    setupPagination(tab.id, tab.data, tab.columns);
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

      ///Cambiar texto del botón según el tab activo
      const activeTab = tabsData.find(tab => `#${tab.id}` === link.getAttribute('href'));
      if (activeTab) {
        kzButton.innerHTML = `<i class="bi bi-plus-circle-fill" style="padding-right: 4px;"></i>Agregar ${activeTab.name}`;
      }
    });
  });
}

function setupPagination(tabId, data, columns) {
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
        ${columns.map(col => `<td>${item[col.field] ?? ''}</td>`).join('')}
        <td>
          <button class="btn btn-sm btn-success me-1"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    `).join('');
  }

  function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
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



function initResources() {
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
        { id: 1, nombre: 'Agua', unidad_medida: 'Litros', huella_carbono: '0.5 kg CO₂', pureza: '99%' },
        { id: 2, nombre: 'Gasolina', unidad_medida: 'Litros', huella_carbono: '2.3 kg CO₂', pureza: '95%' }
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
        { id: 1, nombre: 'Agua', pureza: '99%' },
        { id: 2, nombre: 'Gasolina', pureza: '95%' }
      ]
    },
    {
      id: 'medidas',
      name: 'Medidas',
      columns: [
        { label: 'ID', field: 'id' },
        { label: 'Nombre', field: 'nombre' },
        { label: 'Unidad de medida', field: 'unidad_medida' }
      ],
      data: [
        { id: 1, nombre: 'Agua', unidad_medida: 'Litros' },
        { id: 2, nombre: 'Gasolina', unidad_medida: 'Litros' }
      ]
    }
    // Agrega más tabs según necesites
  ];

  renderTabs(tabsData);
}
