
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
  renderTabs(tabsData);
}

function initConsumptionModal() {
  const modalEl = document.getElementById('comsumptionsFormModal');
  if (!modalEl) return;
  /// si ya existía, getOrCreateInstance no crea una nueva
  window.consumptionsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
}
///TODO: ACA IRA LA LOGICA DEL POST 
document.getElementById('consumptionsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('purezatxt');
  console.log(text)
  window.consumptionsModal.hide();
});

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