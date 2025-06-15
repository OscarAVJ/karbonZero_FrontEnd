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
        { label: 'Unidad de medida', field: 'unidad_medida' }
      ],
      data: [
        { id: 1, nombre: 'Agua', unidad_medida: 'Litros' },
        { id: 2, nombre: 'Gasolina', unidad_medida: 'Litros' }
      ]
    }
  ];

  renderTabs(tabsData);
}
///Render de tabs
function renderTabs(tabsData) {
  const tabList   = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');
  const kzButton  = document.getElementById('button-kz');

  tabList.innerHTML   = '';
  tabContent.innerHTML = '';

  //!Aca se manipulan los tabs
  tabsData.forEach((tab, idx) => {
    const tabItem = document.createElement('li');
    tabItem.className = 'nav-item';
    tabItem.innerHTML = `
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">${tab.name}</a>
    `;
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
      </div>
    `;
    tabContent.appendChild(tabPane);
    setupPagination(tabPane, tab.data, tab.columns);
  });

  kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${tabsData[0].name}`;

  tabList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href'); 
      const activeTab = tabsData.find(t => `#${t.id}` === href);
      ///Aca es donde nosotros ponemos o bueno, cambiamos el nombre del boton en base al tab en el que estemos
      if (activeTab) {
        kzButton.innerHTML =
          `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${activeTab.name}`;
      }

      tabList.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function setupPagination(tabPane, data, columns) {
  const tbody = tabPane.querySelector('tbody');
  const pagination = tabPane.querySelector('.pagination');

  let currentPage   = 1;
  const itemsPerPage = 10;

  function renderTablePage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const items = data.slice(start, start + itemsPerPage);

    tbody.innerHTML = items.map(item => `
      <tr>
        ${columns.map(c => `<td>${item[c.field] ?? ''}</td>`).join('')}
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
    const end   = Math.min(currentPage * itemsPerPage, data.length);

    pagination.innerHTML = '';

    const info = `<div class="text-muted">Mostrando ${start}-${end} de ${data.length}</div>`;
    const ul   = document.createElement('ul');
    ul.className = 'pagination mb-0';

    const addButton = (label, page, disabled = false, active = false) => {
      const li = document.createElement('li');
      li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
      li.innerHTML = `<button class="page-link" ${disabled ? 'tabindex="-1"' : ''}>${label}</button>`;
      if (!disabled && !active) li.firstChild.addEventListener('click', () => {
        renderTablePage(page);
        renderPagination();
      });
      ul.appendChild(li);
    };

    addButton('«', currentPage - 1, currentPage === 1);
    for (let p = 1; p <= totalPages; p++) addButton(p, p, false, p === currentPage);
    addButton('»', currentPage + 1, currentPage === totalPages);

    pagination.insertAdjacentHTML('beforeend', info);
    pagination.appendChild(ul);
  }

  renderTablePage(currentPage);
  renderPagination();
}
