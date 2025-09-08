import * as userController from "../controllers/userPageControllers/userController.js";
import * as rolController from "../controllers/userPageControllers/rolController.js";
import { initAllUsersTabs } from "../controllers/userPageControllers/userInitController.js"
import { getAllRolesList } from "../services/rolService.js";
import * as Alerts from "../../utils/alerts.js";

///Esto es lo que va suceder al ingresar a la pagina, lo definimos en routes.js
///Aca mas que todo mandamos el html, titulos, contenedores, y modales
export function render() {
  return `
<div class="py-4" id="users-root">
  <h2 class="general-title">Usuarios</h2>
  <ul class="nav nav-tabs mb-3" id="tabList"></ul>
  <div class="tab-content" id="tabContent-Users">
    <div class="tab-pane fade show active" id="users">
      <div
        class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
        style="background: #f5f5f5"
      >
        <div
          class="input-group search-bar flex-grow-1"
          style="max-width: 400px"
        >
          <span class="input-group-text border-0">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control border-0 bg-transparent"
            placeholder="Buscar"
            id="userSearch"
          />
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
          <button
            class="kz-button-create"
            id="addUser-kz"
            data-bs-toggle="modal"
            data-bs-target="#usersModal"
          >
            Crear Usuario
          </button>
        </div>
      </div>
      <div id="userTable"></div>
      <!-- Paginación -->
      <div class="row flex-nowrap mt-2" style="overflow-x: auto">
        <div class="col-auto d-flex justify-content-start">
          <select
            class="form-select"
            aria-label="Items por pagina"
            id="itemsUserSelect"
          >
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div class="col d-flex justify-content-end">
          <nav
            aria-label="Page navigation example"
            class="d-flex justify-content-center"
          >
            <ul class="pagination mb-0" id="userPagination"></ul>
          </nav>
        </div>
      </div>
    </div>
    <div class="tab-pane fade" id="roles">
      <div
        class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
        style="background: #f5f5f5"
      >
        <div
          class="input-group search-bar flex-grow-1"
          style="max-width: 400px"
        >
          <span class="input-group-text border-0">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control border-0 bg-transparent"
            placeholder="Buscar"
            id="rolSearch"
          />
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
          <button
            class="kz-button-create"
            id="addRolr-kz"
            data-bs-toggle="modal"
            data-bs-target="#rolModal"
          >
            Crear Rol
          </button>
        </div>
      </div>
      <div id="rolTable"></div>
      <!-- Paginación -->
      <div class="row flex-nowrap mt-2" style="overflow-x: auto">
        <div class="col-auto d-flex justify-content-start">
          <select
            class="form-select"
            aria-label="Items por pagina"
            id="itemsRolSelect"
          >
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div class="col d-flex justify-content-end">
          <nav
            aria-label="Page navigation example"
            class="d-flex justify-content-center"
          >
            <ul class="pagination mb-0" id="rolPagination"></ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <div
    class="modal fade"
    id="usersModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content kz-modal-mongo border-0">
        <div
          class="modal-header"
          style="justify-content: center; position: relative"
        >
          <h4 class="kz-modal-title" id="exampleModalLongTitle">Usuarios</h4>
          <button
            type="button"
            class="btn-close"
            style="position: absolute; right: 1rem; top: 1rem"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form id="userForm">
          <div class="modal-body mx-3">
            <div class="row g-2 mb-3">
              <div class="col-sm-6">
                <label for="nombretxt" class="form-label">Nombre</label>
                <input
                  id="nombretxt"
                  type="text"
                  class="form-control"
                  placeholder="Nombre"
                />
              </div>
              <div class="col-sm-6">
                <label for="apellidotxt" class="form-label">Apellido</label>
                <input
                  id="apellidotxt"
                  type="text"
                  class="form-control"
                  placeholder="Apellido"
                />
              </div>
            </div>
            <div class="row g-2 mb-3">
              <div class="col-sm-6">
                <label for="usuariotxt" class="form-label">Usuario</label>
                <input
                  id="usuariotxt"
                  type="text"
                  class="form-control"
                  placeholder="Usuario"
                  required
                />
              </div>
              <div class="col-sm-6">
                <label for="correoElectronicotxt" class="form-label"
                  >Correo electrónico</label
                >
                <input
                  id="correoElectronicotxt"
                  type="email"
                  class="form-control"
                  placeholder="Correo"
                  required
                />
              </div>
              <div class="col-sm-6 d-none">
                <label for="idtxt" class="form-label">id</label>
                <input
                  id="idtxt"
                  type="text"
                  class="form-control"
                  placeholder="id"
                />
              </div>
            </div>
            <div class="row g-2 mb-3">
              <label for="roltxt" class="form-label">Rol</label>
              <select id="roltxt" class="form-select"></select>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="submit" class="btn kz-button-create">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
      class="modal fade"
      id="rolModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content kz-modal-mongo border-0">
          <div
            class="modal-header"
            style="justify-content: center; position: relative"
          >
            <h4 class="kz-modal-title" id="exampleModalLongTitle">Roles</h4>
            <button
              type="button"
              class="btn-close"
              style="position: absolute; right: 1rem; top: 1rem"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form id="rolForm">
            <div class="modal-body mx-3">
              <div class="row g-2 mb-3">
                <div class="row g-2 mb-3">
                  <label for="rolNameTxt" class="form-label">Nombre</label>
                  <input
                    id="rolNameTxt"
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                  />
                </div>
                <div class="row g-2 mb-3">
                  <label for="levelSelect" class="form-label">Rol</label>
                  <select id="levelSelect" class="form-select">
                    <option value="0">Lector</option>
                    <option value="1">Administrador</option>
                  </select>
                </div>
                <div class="row g-2 mb-3 d-none">
                  <label for="rolIdTxt" class="form-label">id</label>
                  <input
                    id="rolIdTxt"
                    type="text"
                    class="form-control"
                    placeholder="id"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button type="submit" class="btn kz-button-create">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}

///Esto es lo que pasa cuando ya hemos renderizado nuestra pagina
export async function afterRender() {
    const container = document.getElementById("users-root");
    await initAllUsersTabs(container);
    userProcess();
    rolProcess();
}

async function userProcess() {
    
  ///Obtenemos roles
  let roles = await getAllRolesList();
  ///Aca mandamos a llamar el init de userController que es el que llena la tabla, por eso le pasamos container
  const container = document.getElementById("users-root");

  ///Obtenemos nuestros elementos
  const addUserBtn = document.querySelector("#addUser-kz");
  const nametxt = document.querySelector("#nombretxt");
  const lastNametxt = document.querySelector("#apellidotxt");
  const usernametxt = document.querySelector("#usuariotxt");
  const emailtxt = document.querySelector("#correoElectronicotxt");
  const usersForm = document.querySelector("#userForm");
  const modalEl = document.getElementById("usersModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const idHideen = document.querySelector("#idtxt");
  const rolesSelect = document.querySelector("#roltxt");

  const userSearch = document.querySelector("#userSearch");
  userSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      userController.setCurrentPage(0);
      userController.reload(container);
    }
  });

  ///Aca mandamos a llenar el loadRoles y le pasamos los roles que hemos obtenido asi como el formselect
  userController.loadRoles(roles, rolesSelect);

  ///Aca definimos que si el boton existe, al hacerle click vamos a limpiar los campos al cargar
  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      idHideen.value = "";
      nametxt.value = "";
      lastNametxt.value = "";
      usernametxt.value = "";
      emailtxt.value = "";
      rolesSelect.selectedIndex = 0;
    });
  }

  let isLoading = false;
  ///Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
  usersForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!usernametxt.value.trim()) {
      Alerts.showToastCloseError("El nombre de usuario es obligatorio");
      return;
    }

    if (!emailtxt.value.trim()) {
      Alerts.showToastCloseError("El correo electrónico es obligatorio");
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idHideen.value) {
      res = await userController.updateUser(
        usernametxt,
        nametxt,
        lastNametxt,
        emailtxt,
        rolesSelect,
        usersForm,
        idHideen
      );
    } else {
      res = await userController.insertUser(
        usernametxt,
        nametxt,
        lastNametxt,
        emailtxt,
        rolesSelect,
        usersForm
      );
    }

    bsModal.hide();
    isLoading = false;
    idHideen.value = "";
    ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
    if (res?.ok) {
      await userController.reload(container);
    }
  });
}

async function rolProcess() {
  ///Obtenemos roles
  ///Aca mandamos a llamar el init de userController que es el que llena la tabla, por eso le pasamos container
  const container = document.getElementById("users-root");

  ///Obtenemos nuestros elementos
  const addRolBtn = document.querySelector("#addRol-kz");
  const nametxt = document.querySelector("#rolNameTxt");
  const levelSelect = document.querySelector("#levelSelect");
  const idHideen = document.querySelector("#rolIdTxt");

  const rolForm = document.querySelector("#rolForm");
  const modalEl = document.querySelector("#rolModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);

  const rolSearch = document.querySelector("#rolSearch");
  rolSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      rolController.setCurrentPage(0);
      rolController.reload(container);
    }
  });

  ///Aca definimos que si el boton existe, al hacerle click vamos a limpiar los campos al cargar
  if (addRolBtn) {
    addUserBtn.addEventListener("click", () => {
      idHideen.value = "";
      nametxt.value = "";
      levelSelect.selectedIndex = 0;
    });
  }

  let isLoading = false;
  ///Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
  rolForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nametxt.value.trim()) {
      Alerts.showToastCloseError("El nombre del rol es obligatorio");
      return;
    }

    if (levelSelect.value != "0" && levelSelect.value != "1") {
      Alerts.showToastCloseError("El nivel de permiso no es válido");
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idHideen.value) {
      res = await rolController.updateRol(
        nametxt,
        levelSelect,
        rolForm,
        idHideen
      );
    } else {
      res = await rolController.insertRol(
        nametxt,
        levelSelect,
        rolForm
      );
    }

    bsModal.hide();
    isLoading = false;
    idHideen.value = "";
    ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
    if (res?.ok) {
      await rolController.reload(container);
    }
  });
}
