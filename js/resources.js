;(function(){
  const modalMap = {
    recursos:   'recursosModal',
    pureza:     'purezaModal',
    medidas:    'medidasModal',
    unidades:   'unidadesModal',
    conversion: 'conversionModal'
  };

  const tabList    = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');
  const kzButton   = document.getElementById('button-kz');

  function initResources() {
    kzButton.setAttribute('type', 'button');
    kzButton.setAttribute('data-bs-toggle', 'modal');
    kzButton.setAttribute('data-bs-target', '#recursosModal');

    const tabsData = [
      {
        id: 'recursos',
        name: 'Recursos',
        columns: [
          { label: 'ID',               field: 'id' },
          { label: 'Nombre',           field: 'nombre' },
          { label: 'Unidad de medida', field: 'unidad_medida' },
          { label: 'Huella de carbono',field: 'huella_carbono' },
          { label: 'Pureza',           field: 'pureza' }
        ],
        data: [
          { id: 1, nombre: 'Agua',     unidad_medida: 'Litros', huella_carbono: '0.5 kg CO₂', pureza: '99 %' },
          { id: 2, nombre: 'Gasolina', unidad_medida: 'Litros', huella_carbono: '2.3 kg CO₂', pureza: '95 %' }
        ]
      },
      {
        id: 'pureza',
        name: 'Pureza',
        columns: [
          { label: 'ID',     field: 'id' },
          { label: 'Nombre', field: 'nombre' },
          { label: 'Pureza', field: 'pureza' }
        ],
        data: [
          { id: 1, nombre: 'Agua',     pureza: '99 %' },
          { id: 2, nombre: 'Gasolina', pureza: '95 %' }
        ]
      },
      {
        id: 'medidas',
        name: 'Medidas',
        columns: [
          { label: 'ID',               field: 'id' },
          { label: 'Nombre',           field: 'nombre' },
        ],
        data: [
          { id: 1, nombre: 'Agua',},
          { id: 2, nombre: 'Gasolina'}
        ]
      },
      {
        id: 'unidades',
        name: 'Unidades de medida',
        columns: [
          { label: 'ID',             field: 'id' },
          { label: 'Medida',         field: 'medida' },
          { label: 'Unidad de medida', field: 'unidad_medida' }
        ],
        data: [
          { id: 1, medida: 'Volumen', unidad_medida: 'Litros' },
          { id: 2, medida: 'Masa',    unidad_medida: 'Kilogramos' }
        ]
      },
      {
        id: 'conversion',
        name: 'Conversión de unidades',
        columns: [
          { label: 'ID',              field: 'id' },
          { label: 'Unidad inicial',  field: 'unidad_inicial' },
          { label: 'Unidad final',    field: 'unidad_final' },
          { label: 'Recurso',         field: 'recurso' },
          { label: 'Operación',       field: 'operacion' },
          { label: 'Constante',       field: 'constante' }
        ],
        data: [
          {
            id: 1,
            unidad_inicial: 'Litros',
            unidad_final:   'Mililitros',
            recurso:        'Agua',
            operacion:      'Multiplicar',
            constante:      '1000'
          },
          {
            id: 2,
            unidad_inicial: 'Kilogramos',
            unidad_final:   'Gramos',
            recurso:        'Papel',
            operacion:      'Multiplicar',
            constante:      '1000'
          }
        ]
      }
    ];

    renderTabs(tabsData);
  }

  function renderTabs(tabsData) {
    tabList.innerHTML    = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
      const tabItem = document.createElement('li');
      tabItem.className = 'nav-item';
      tabItem.innerHTML = `
        <a class="nav-link ${idx===0?'active':''}"
           data-bs-toggle="tab"
           href="#${tab.id}">
           ${tab.name}
        </a>`;
      tabList.appendChild(tabItem);

      const tabPane = document.createElement('div');
      tabPane.className = `tab-pane fade${idx===0?' show active':''}`;
      tabPane.id = tab.id;
      tabPane.innerHTML = `
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                ${tab.columns.map(c=>`<th>${c.label}</th>`).join('')}
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

      setupPagination(tabPane, tab.data, tab.columns, tab.id);
    });

    kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${tabsData[0].name}`;

    // Listener para cambiar pestaña y actualizar botón/modal
    tabList.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        const active = tabsData.find(t=>`#${t.id}`===href);

        // marcar activa
        tabList.querySelectorAll('a.nav-link').forEach(l=>l.classList.remove('active'));
        link.classList.add('active');

        if (active) {
          kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${active.name}`;
          kzButton.setAttribute('data-bs-target', `#${modalMap[active.id]}`);
        }
      });
    });
  }

  function setupPagination(tabPane, data, columns, name) {
    const tbody      = tabPane.querySelector('tbody');
    const pagination = tabPane.querySelector('.pagination');
    let currentPage  = 1;
    const perPage    = 10;

    function renderPage(page) {
      currentPage = page;
      const start  = (page-1)*perPage;
      const slice  = data.slice(start, start+perPage);

      tbody.innerHTML = slice.map(item=>`
        <tr>
          ${columns.map(c=>`<td>${item[c.field]||''}</td>`).join('')}
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
      const totalPages = Math.ceil(data.length/perPage) || 1;
      const info       = `<div class="text-muted">Mostrando ${(currentPage-1)*perPage+1}-${Math.min(currentPage*perPage,data.length)} de ${data.length}</div>`;
      const ul         = document.createElement('ul');
      ul.className     = 'pagination mb-0';

      function addBtn(label, page, disabled, active) {
        const li = document.createElement('li');
        li.className = `page-item${disabled?' disabled':''}${active?' active':''}`;
        li.innerHTML = `<button class="page-link" ${disabled?'tabindex="-1"':''}>${label}</button>`;
        if (!disabled && !active) li.firstChild.addEventListener('click', ()=>{ renderPage(page); renderPagination(); });
        ul.appendChild(li);
      }

      pagination.innerHTML = '';
      addBtn('«', currentPage-1, currentPage===1);
      for (let p=1; p<=totalPages; p++) addBtn(p, p, false, p===currentPage);
      addBtn('»', currentPage+1, currentPage===totalPages);

      pagination.insertAdjacentHTML('afterbegin', info);
      pagination.appendChild(ul);
    }

    renderPage(currentPage);
    renderPagination();
  }

  window.initResources = initResources;
})();
