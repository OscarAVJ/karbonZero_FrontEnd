import * as UserController from '../controllers/userController.js';
import { getRoles } from '../services/rolService.js';

///Esto es lo que va suceder al ingresar a la pagina, lo definimos en routes.js
///Aca mas que todo mandamos el html, titulos, contenedores, y modales
export function render() {
  return `
    <div class="py-4" id="users-root">
      <h2 class="general-title">Usuarios</h2>
      <div
        class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
        style="background:#f5f5f5;"
      >
        <div
          class="input-group search-bar flex-grow-1"
          style="max-width: 400px;"
        >
          <span class="input-group-text bg-transparent border-0">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control border-0 bg-transparent"
            placeholder="Buscar"
          >
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
          <div class="dropdown">
            <button
              class="btn btn-light d-flex align-items-center gap-2 border rounded-3 px-3"
              type="button"
              id="dropdownMes"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
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
            <button
              class="btn btn-light d-flex align-items-center gap-2 border rounded-3 px-3"
              type="button"
              id="dropdownTrimestre"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-calendar"></i> Trimestre
              <i class="bi bi-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownTrimestre">
              <li><a class="dropdown-item" href="#">Q1</a></li>
              <li><a class="dropdown-item" href="#">Q2</a></li>
              <li><a class="dropdown-item" href="#">Q3</a></li>
            </ul>
          </div>
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
      <ul class="nav nav-tabs mb-3" id="tabList"></ul>
      <div class="tab-content" id="tabContent"></div>
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
            style="justify-content: center; position: relative;"
          >
            <h4 class="kz-modal-title" id="exampleModalLongTitle">Usuarios</h4>
            <button
              type="button"
              class="btn-close"
              style="position: absolute; right: 1rem; top: 1rem;"
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
                  >
                </div>
                <div class="col-sm-6">
                  <label for="apellidotxt" class="form-label">Apellido</label>
                  <input
                    id="apellidotxt"
                    type="text"
                    class="form-control"
                    placeholder="Apellido"
                  >
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
                  >
                </div>
                
                <div class="col-sm-6">
                  <label
                    for="correoElectronicotxt"
                    class="form-label"
                  >Correo electrónico</label>
                  <input
                    id="correoElectronicotxt"
                    type="email"
                    class="form-control"
                    placeholder="Correo"
                  >
                </div>
                <div class="col-sm-6 d-none">
                  <label
                    for="idtxt"
                    class="form-label"
                  >id</label>
                  <input
                    id="idtxt"
                    type="text"
                    class="form-control"
                    placeholder="id"
                  >
                </div>
              </div>
               <div class="row g-2 mb-3 ">
                  <label for="roltxt" class="form-label">Rol</label>
                    <select id="roltxt" class="form-select">
                  </select>
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
  `;
}

///Esto es lo que pasa cuando ya hemos renderizado nuestra pagina
export async function afterRender() {
  ///Obtenemos roles
  let roles = await getRoles();
  ///Aca mandamos a llamar el init de userController que es el que llena la tabla, por eso le pasamos container
  const container = document.getElementById('users-root');
  UserController.init(container);

  ///Obtenemos nuestros elementos
  const addUserBtn = document.querySelector('#addUser-kz');
  const nametxt = document.querySelector('#nombretxt');
  const lastNametxt = document.querySelector('#apellidotxt');
  const usernametxt = document.querySelector('#usuariotxt');
  const emailtxt = document.querySelector('#correoElectronicotxt');
  const usersForm = document.querySelector('#userForm');
  const modalEl = document.getElementById('usersModal')
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl)
  const idHideen = document.querySelector('#idtxt');
  const rolesSelect = document.querySelector('#roltxt');

  ///Aca mandamos a llenar el loadRoles y le pasamos los roles que hemos obtenido asi como el formselect
  UserController.loadRoles(roles, rolesSelect);

  ///Aca definimos que si el boton existe, al hacerle click vamos a limpiar los campos al cargar
  if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
      nametxt.value = '';
      lastNametxt.value = '';
      usernametxt.value = '';
      emailtxt.value = '';
    });
  }

  ///Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
  usersForm.addEventListener('submit', () => {
    if (idHideen.value) {
      UserController.updateUser(usernametxt, nametxt, lastNametxt, emailtxt, rolesSelect, usersForm,idHideen);
      bsModal.hide()
    } else {
      UserController.insertUser(usernametxt, nametxt, lastNametxt, emailtxt, rolesSelect ,usersForm);
      bsModal.hide()
    }
  })
}