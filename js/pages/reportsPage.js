import {
  addCellByNumber,
  exportToExcel,
  exportToPdf,
  exportToWord,
  loadResouceSelect,
  loadResourcesTable,
  loadTable,
  renderNotebook,
  validateValues,
  validateValuesToImport,
} from "../controllers/reportsController";
import { getAllConsumptionsByFiltersMonth } from "../services/consumptionService";
import { getAllResourcePuritiesList } from "../services/puritiesServices";
import * as Alerts from "../../utils/alerts.js";
import {
  getAllResources,
  getAllResourcesSP,
} from "../services/resourcesService.js";

export async function render() {
  return `
  <div class="main-scroll">
    <div class="py-4">
      <h2 class="general-title">Reportes</h2>
      <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top z-0">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav gap-2">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-auto-close="outside" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type-icon lucide-type"><path d="M12 4v16"/><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"/><path d="M9 20h6"/></svg>
                   Agregar elemento
                </a>
                <ul class="dropdown-menu" id="dropdown-menu-main">
                  <li>
                    <a class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Encabezados</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" id="liveToastBtnH1" data-number="1">H1</a></li>
                      <li><a class="dropdown-item" id="liveToastBtnH2" data-number="2">H2</a></li>
                      <li><a class="dropdown-item" id="liveToastBtnH3" data-number="3" >H3</a></li>
                      <li><a class="dropdown-item" id="liveToastBtnH4" data-number="4">H4</a></li>
                      <li><a class="dropdown-item" id="liveToastBtnH5" data-number="5" >H5</a></li>
                      <li><a class="dropdown-item" id="liveToastBtnH6" data-number="6">H6</a></li>
                    </ul>
                  </li>
                  <li><a class="dropdown-item" id="liveToastBtnP" data-number="7">Texto</a></li>
                </ul>
              </li>
              <li>
                <a class="nav-item text-decoration-none"><button class="btn btn-outline-secondary d-flex align-items-center gap-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offCanvasInsertTable" aria-controls="offCanvasInsertTable"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table-icon lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>Insertar tabla</button>
                </a>
              </li>                   
              <li>
                  <button class="btn btn-outline-danger d-flex align-items-center gap-2" id="exportToPdf"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>Exportar a PDF</button>
              </li>
              <li>
                <a class="nav-item text-decoration-none"><button id="exportToWordBtn"class="btn btn-outline-primary d-flex align-items-center gap-2" type="button" aria-controls="offCanvasFilterData"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-type-icon lucide-file-type"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 13v-1h6v1"/><path d="M12 12v6"/><path d="M11 18h2"/></svg>Exportar a Word</button>
                </a>
              </li>    
              <li>
                <a class="nav-item text-decoration-none"><button class="btn btn-outline-success d-flex align-items-center gap-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offCanvasFilterData" aria-controls="offCanvasFilterData"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sheet-icon lucide-sheet"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="9" y2="21"/><line x1="15" x2="15" y1="9" y2="21"/></svg>Generar Excel</button>
                </a>
              </li>             
            </ul>
          </div>
        </div>
      </nav>
      <section>
        <div class="container my-3">
          <div id="notebook">
          </div>
        </div>
      </section>
        <div class="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header d-flex justify-content-end">
              <strong class="me-auto">Agrega tu contenido</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              <div class="input-group mb-3">
                <input type="text" class="form-control" id="toastValue"placeholder="Agrega tu contendio" aria-label="Recipients username" aria-describedby="btn-create-element">
              <button class="btn btn-outline-success" type="button" data-bs-dismiss="toast" id="btn-create-element"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg></button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offCanvasFilterData" aria-labelledby="offcanvasWithBothOptionsLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Filtros</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body container">
            <p>Crea tablas en base a los filtros que selecciones.</p>
              <div class="d-flex align-items-center gap-2">
                <button id="exportExcelBtn"class="btn btn-outline-success d-flex aling-items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sheet-icon lucide-sheet"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="9" y2="21"/><line x1="15" x2="15" y1="9" y2="21"/></svg>Exportar a Excel</button>
                <button type="button" id="previewBtn" class="btn btn-outline-primary d-flex aling-items-center gap-2" data-bs-toggle="modal" data-bs-target="#previewTable">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>Vista previa
                </button>
              </div>

              <div class="d-flex align-items-center gap-2 mt-2">
                <div>
                  <label for="fechaInicioReporte">Fecha inicio</label>
                  <input id="fechaInicioReporte" class="form-control" type="date" />                
                </div>
                <div>
                  <label for="fechaFinReporte">Fecha fin</label>
                  <input id="fechaFinReporte" class="form-control" type="date" />                
                </div>                
              </div>
              <div class="row mt-2">
                <div class="col-8">
                  <label for="selectResourceReport" class="form-label">Recurso</label>
                  <select class="form-select" id="selectResourceReport" aria-label="Default select example">
                    <option value="" disabled selected>Selecciona un recurso para filtrar</option>
                  </select>
                </div>
                <div class="col-4 d-flex align-items-end">
                  <button type="button" id="addResourceReport" 
                          class="btn btn-outline-success d-flex align-items-center gap-2">
                    Agregar
                  </button>
                </div>
              </div>
              <p class="mb-2 mt2">Agrega los recursos que quieres ver en tu excel</p>
              <div class="table-responsive mt-2">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                        <th>Recurso</th>
                    </tr>
                  </thead>
                  <tbody id="TableToSelectResources">

                  </tbody>
                </table>
            </div>
          </div>
        </div>

        <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offCanvasInsertTable" aria-labelledby="offcanvasWithBothOptionsLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Filtros</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body container">
            <p>Importa tablas a tu pagina en base a los filtros que selecciones.</p>
              <div class="d-flex align-items-center gap-2 mt-2">
                <div>
                  <label for="fechaInicioReporte2">Fecha inicio</label>
                  <input id="fechaInicioReporte2" class="form-control" type="date" />                
                </div>
                <div>
                  <label for="fechaFinReporte2">Fecha fin</label>
                  <input id="fechaFinReporte2" class="form-control" type="date" />                
                </div>                
              </div>
              <div class="form-check m-2">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
                <label class="form-check-label" for="flexCheckChecked">
                  Reporte general
                </label>
              </div>
              <div class="row mt-2">
                <div class="col-8" id="selectResourceContainer">
                  <label for="selectResourceReport2" class="form-label">Recurso</label>
                  <select class="form-select" id="selectResourceReport2" aria-label="Default select example">
                    <option value="0" selected>Selecciona un recurso para filtrar</option>
                  </select>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2 mt-2">
                <button id="importTableBtn"class="btn btn-outline-success d-flex aling-items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-import-icon lucide-import"><path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/></svg>Insertar</button>
                <button type="button" id="previewBtn2" class="btn btn-outline-primary d-flex aling-items-center gap-2" data-bs-toggle="modal" data-bs-target="#previewTable">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>Vista previa
                </button>
              </div>
              <div class="d-none table-responsive mt-2" id="loadTableToImport">
                
            </div>
          </div>
        </div>      
      <div class="modal modal-dialog-center fade" id="previewTable" tabindex="-2" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Vista previa</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="previewModalBody" class="modal-body">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}
export async function afterRender() {
  ///Referencia a los controles que abren un toast
  const toastTrigger1 = document.querySelector("#liveToastBtnH1");
  const toastTrigger2 = document.querySelector("#liveToastBtnH2");
  const toastTrigger3 = document.querySelector("#liveToastBtnH3");
  const toastTrigger4 = document.querySelector("#liveToastBtnH4");
  const toastTrigger5 = document.querySelector("#liveToastBtnH5");
  const toastTrigger6 = document.querySelector("#liveToastBtnH6");
  const toastTriggerP = document.querySelector("#liveToastBtnP");

  ///Referencia a MUCHOS controles, creo que los nombres son lo suficiente claros
  const toastLiveExample = document.getElementById("liveToast");
  const previewBtn = document.getElementById("previewBtn");
  const previewBtn2 = document.getElementById("previewBtn2");
  const tableToImport = document.getElementById("loadTableToImport");
  const exportExcel = document.getElementById("exportExcelBtn");
  const initialDate = document.getElementById("fechaInicioReporte");
  const lastDate = document.getElementById("fechaFinReporte");
  const initialDate2 = document.getElementById("fechaInicioReporte2");
  const lastDate2 = document.getElementById("fechaFinReporte2");
  const resourceSelected = document.getElementById("selectResourceReport");
  const resourceSelected2 = document.getElementById("selectResourceReport2");
  const importTableBtn = document.getElementById("importTableBtn");
  const previewModalBody = document.getElementById("previewModalBody");
  const addResourceBtn = document.getElementById("addResourceReport");
  const toastEl = document.getElementById("liveToast");
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  const toastInput = document.getElementById("toastValue");
  const exportToWordBtn = document.getElementById("exportToWordBtn");
  const displayResourceOpt = document.getElementById("flexCheckChecked");
  const selectResourceForTable = document.getElementById(
    "selectResourceContainer"
  );
  const notebook = document.getElementById("notebook");
  const exportToPdfBtn = document.getElementById("exportToPdf");
  const tableToSelectResource = document.getElementById(
    "TableToSelectResources"
  );

  ///Inicializamos nuestro "cuaderno" vacio, osea que le pasamos los valores iniciales de notebook
  renderNotebook(notebook);

  ///Llenamos los 2 dropdowns, uno es el de exportar a excel y el otro de importar tabla
  const data = await getAllResourcesSP();

  loadResouceSelect(data, resourceSelected);
  loadResouceSelect(data, resourceSelected2);
  const now = new Date();
  const currentYear = now.getFullYear();
  initialDate.max = `${currentYear}-12-31`;
  initialDate2.max = `${currentYear}-12-31`;
  lastDate.max = `${currentYear}-12-31`;
  lastDate2.max = `${currentYear}-12-31`;

  ///Iniamos un array de recursos
  let resources = [];
  ///TODO: Hacer que esto sirva

  ///Agregamos un registro a nuestra tabla (resources)
  addResourceBtn.addEventListener("click", () => {
    const value = resourceSelected.value?.trim();
    if (!value) return;
    ///Esto sera el valor de la columna name de nuestro tabla
    const item = { nameR: value };
    resources.push(item);
    ///Aca pueden ver como se renderiza la tabla
    loadResourcesTable(tableToSelectResource, item);
  });

  ///Evento para visualizar previamente la informacion que se enviara a el excel
  previewBtn.addEventListener("click", async () => {
    previewModalBody.innerHTML = "";

    const resourceName = resourceSelected.value;

    ///Validamos que los datos si esten
    if (validateValues(initialDate.value, lastDate.value) === false) {
      Alerts.showToastCloseInfo(
        "Favor seleccionar el filtro de fechas y el nombre del recurso"
      );
      return;
    }
    ///Creamos un elemento div
    const container = document.createElement("div");
    ///Posteriormente al body del modal le metemos ese div adentro
    previewModalBody.appendChild(container);
    ///Load
    await loadTable(resourceName, initialDate.value, lastDate.value, container);
  });

  ///Evento para visualizar previamente la informacion que se enviara al doc (contenedor de la informacion para pdf)
  previewBtn2.addEventListener("click", async () => {
    previewModalBody.innerHTML = "";
    const resourceName = resourceSelected2.value;

    ///Validamos
    if (validateValues(initialDate2.value, lastDate2.value) === false) {
      Alerts.showToastCloseInfo(
        "Favor seleccionar el filtro de fechas y el nombre del recurso"
      );
      return;
    }
    ///Lo mismo que en el de arriba
    const container = document.createElement("div");
    previewModalBody.appendChild(container);
    await loadTable(
      resourceName,
      initialDate2.value,
      lastDate2.value,
      container
    );
  });

  ///iniciamos nuestro selected number
  let selectedNumber = null;

  ///Aca se maneja el evento del select de los elementos
  document
    .querySelector("#dropdown-menu-main")
    .addEventListener("click", (e) => {
      ///Accedemos al data-number, propiedad a la cual le asignamos valor desde render
      const item = e.target.closest("[data-number]");
      if (!item) return;
      ///Y pues aca
      selectedNumber = item.dataset.number;
      toast.show();
      toastInput.focus();
    });

  ///Este es el boton que tiene el popover, es el que crea los elementos
  document
    .getElementById("btn-create-element")
    .addEventListener("click", () => {
      const text = toastInput.value.trim();
      if (text.length === 0) {
        Alerts.showToastCloseInfo("Escribe algo en el contenido");
        return;
      }

      ///Lo agregamos a nuestro "cuaderno" con el formato
      addCellByNumber(selectedNumber, text, notebook);

      ///Limpiamos el toast
      toastInput.value = "";

      ///SelectedNumber vuelve a ser null
      selectedNumber = null;
      toast.hide();
    });

  ///Lo inicializamos en true por que la primera vez que se le click va a estar checked y ya
  let isChecked = true;
  displayResourceOpt.addEventListener("click", () => {
    ///Si es true
    if (isChecked) {
      selectResourceForTable.classList.add("d-none");
      resourceSelected2.value = "";
    } else {
      selectResourceForTable.classList.remove("d-none");
    }
    ///Invertimos su valor para el siguiente click, el cual sera para descheckearlo??
    isChecked = !isChecked;
  });
  ///Evento de exportar a excel
  exportExcel.addEventListener("click", async () => {
    if (initialDate.value > lastDate.value) {
      Alerts.showToastCloseInfo(
        "La fecha inicial no puede ser mayor a la fecha final"
      );
      return;
    }
    await exportToExcel(initialDate, lastDate, resourceSelected, resources);
  });
  ///Evento de exportar a pdf
  exportToPdfBtn.addEventListener("click", async () => {
    console.log(previewModalBody);
    exportToPdf(notebook);
  });
  ///Evento de exportar a word
  exportToWordBtn.addEventListener("click", async () => {
    console.log(previewModalBody);
    exportToWord(notebook);
  });

  ///Aca lo que hacemos el obtener lo que se esta mandando a buscar para incrustarlo en el notebook despues con la funcion de importTable
  async function getTableDataset(resource, init, end) {
    const data = await getAllConsumptionsByFiltersMonth(resource, init, end);
    if (data.length === 0) {
      Alerts.showInfo(
        "No hay datos que coincidan para los filtros seleccionados"
      );
      return;
    }
    ///Obtenemos la data
    const dataset = {
      title: `Consumos ${resource ?? ""} (${init}–${end})`,
      columns: ["#", "Recurso", "Cantidad", "Fecha", "Costo"],
      ///Iteramos las filas obtenidas
      rows: data.map((c, i) => [
        i + 1,
        c.resourcePurityName,
        c.quantity + " " + c.resourceMeasureUnit,
        (c.consumptionDate || "").split(" ")[0],
        "$" + c.cost,
      ]),
    };
    return dataset;
  }

  ///Aca es el evento para insertar las tablas
  importTableBtn.addEventListener("click", async () => {
    tableToImport.innerHTML = "";
    const resourceName = resourceSelected2.value;
    if (initialDate2.value > lastDate2.value) {
      Alerts.showToastCloseInfo(
        "La fecha inicial no puede ser mayor a la fecha final"
      );
      return;
    }
    if (!isChecked && resourceSelected2.value === 0) {
      Alerts.showToastCloseInfo("Debes seleccionar un recurso");
      return;
    }
    if (!validateValuesToImport(initialDate2.value, lastDate2.value)) {
      Alerts.showToastCloseInfo(
        "Favor seleccionar el filtro de fechas y el nombre del recurso"
      );
      return;
    }

    ///Obtenemos la data
    const dataset = await getTableDataset(
      resourceName,
      initialDate2.value,
      lastDate2.value
    );
    if (!dataset) {
      Alerts.showToastCloseInfo("No hay datos para los filtros seleccionados");
      return;
    }

    ///Le pasamos el tipo de dato en este caso tabla, la data y contenedor osea el notebook
    addCellByNumber(10, dataset, notebook);
  });

  ///Aca le asignamos a cada elemento desde el h1-h6 y el p que puedan abrir el toast
  if (toastTrigger1) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger1.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
  if (toastTrigger2) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger2.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
  if (toastTrigger3) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger3.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
  if (toastTrigger4) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger4.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
  if (toastTrigger5) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger5.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
  if (toastTrigger6) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger6.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
  if (toastTriggerP) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTriggerP.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
}
