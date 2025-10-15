import * as RolService from "../../services/rolService.js";
import * as Alerts from "../../../utils/alerts.js";
import {role} from "../sessionController.js";
///Con import podemos acceder a todos los metodos exportados de X archivo

///Nuestro metodo de inicio, lo llamamos en el userPage.js
export async function initRol(container) {
  ///Mandamos el contenedor junto con nuestro metodo init
  renderData(container);
}

let currentPage = 0;
let currentSize = 10;

export async function setCurrentPage(page) {
  currentPage = page;
}

///Aca esta nuestro metodo reload y pues container sera igual al contenedor que le estemos pasando en este caso el final en page va a ser el de roles
export async function reload(container) {
  ///Si nuestro container es nulo....
  if (!container) return;
  ///Si no pues hacemos una peticion get y le pasamos ese array de usuarios + el tab donde queremos poner la grid
  try {
    const rolSearch = document.querySelector("#rolSearch");
    const searchName = rolSearch.value.trim();

    let roles;
    if (!searchName) {
      roles = await RolService.getAllRoles(currentPage, currentSize);
    } else {
      roles = await RolService.getAllRolesByName(
        searchName,
        currentPage,
        currentSize
      );
    }
    const tabContent = container.querySelector("#rolTable");
    loadRolesTable(roles.content, tabContent);
    ///Llamamos a renderPagination para que siempre pues vaya cambiando en base a la pagina y numero en el cual se encuentre al hacer reload
    renderPagination(roles.number, roles.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

///Funcion para renderizar los datos asi como los eventos de nuestro formulario
async function renderData(container) {
  ///Variables con nuestro tabList y el contenido(nuestra tabla)
  const tabContent = container.querySelector("#rolTable");
  
  let roles;
  ///Llenamos los roles
  try {
    ///traemos el json en data
    roles = await RolService.getAllRoles(currentPage, currentSize);
    ///Llamamos al renderPagination para que carge cuando inicie todo
    renderPagination(roles.number, roles.totalPages, container);
  } catch (error) {
    console.error(error);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar los roles.</p>`);
  }

  ///Cargamos datos, pasamos nuestros usuarios y nuestro contenedor
  loadRolesTable(roles.content, tabContent);
  renderPagination(roles.number, roles.totalPages, container);

  const sizeSelector = document.getElementById("itemsRolSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-rol");
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await RolService.deleteRol(id);
    ///En caso de que nos devuelva un true recargamos
    if (ok) await reload(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit-rol");
    if (!editBtn) return;
    const id = editBtn.dataset.id;
    try {
      const rol = await RolService.getRolById(id);
      document.querySelector("#rolIdTxt").value = rol.idRol ?? "";
      document.querySelector("#rolNameTxt").value = rol.name ?? "";
      document.querySelector("#levelSelect").value = rol.status ?? "";
    } catch (err) {
      Alerts.showToastCloseError("No se pudo cargar el rol");
      console.error(err);
    }
  });
}

///Aca cargamos nuestros usuarios, nada nuevo, eso si en lugar del id mandamos un numero, por que pues si, usamos RAW, xdnt
export function loadRolesTable(users, tab) {
  ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Nivel</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerUsers">
            ${users
              .map(
                (u, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${u.name}</td>
                <td>${u.status == "0" ? "Lector" : "Administrador"}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-rol" data-id="${
                      u.idRol
                    }" data-bs-toggle="modal" data-bs-target="#rolModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-rol" data-id="${
                      u.idRol
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>`;
    role.applyPermissions();
}


///Aca hacemos la funcionalidad del insert, su uso esta en page
export async function insertRol(
  nametxt,
  levelSelect,
  form
) {
  const payload = {
    name: nametxt.value.trim(),
    status: levelSelect.value.trim()
  };
  try {
    const res = await RolService.insertRol(payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar al rol ${err}`);
    ///Retornamos un false
    return { ok: false };
  }
}

///Lo mismo que el insert pero ahora update,
export async function updateRol(
  nametxt,
  levelSelect,
  form,
  id
) {
  const payload = {
    idRol: id.value.trim(),
    name: nametxt.value.trim(),
    status: levelSelect.value.trim(),
  };
  try {
    ///Hacemos la peticion
    const res = await RolService.updateRol(payload, id.value);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError("No se pudo actualizar el rol");
    ///Retornamos un false
    return { ok: false };
  }
}

export function renderPagination(current, totalPages, container) {
  ///Aca accedemos a nuestro ul de pagination
  const pagination = document.getElementById("rolPagination");
  if (!pagination) return;
  pagination.innerHTML = ""; ///Limpiamos la paginacion previa

  ///Este es el boton para ir en retroseso
  const prev = document.createElement("li");
  prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
  prev.innerHTML = ` <a class="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                     </a>`;
  ///Este es su evento
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) {
      currentPage = current - 1; ///Retrocede una pagina
      ///Hacemos reload
      reload(container);
    }
  });
  pagination.appendChild(prev);

  ///Aca controlamos el numero de paginas en base a totalPages
  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === current ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== i) {
        currentPage = i; ///Saltamos a la pagina seleccionada
        reload(container);
      }
    });
    pagination.appendChild(li);
  }

  ///Boton siguiente
  const next = document.createElement("li");
  next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (current < totalPages - 1) {
      currentPage = current + 1; ///Avanza una pagina
      reload(container);
    }
  });
  pagination.appendChild(next);
}

