import * as UserService from '../services/userService.js';
import * as Alerts from '../../utils/alerts.js'
///Con import podemos acceder a todos los metodos exportados de X archivo

///Nuestro metodo de inicio, lo llamamos en el userPage.js
export async function init(container) {
  ///Mandamos el contenedor junto con nuestro metodo init
  renderData(container);
}

let currentPage = 0;
let currentSize = 10;

///Aca esta nuestro metodo reload y pues container sera igual al contenedor que le estemos pasando en este caso el final en page va a ser el de usuarios 
export async function reload(container) {
  ///Si nuestro container es nulo....
  if (!container) return;
  ///Si no pues hacemos una peticion get y le pasamos ese array de usuarios + el tab donde queremos poner la grid
  try {
    const data = await UserService.getUsers(currentPage, currentSize);
    const users = data.content;
    const $tabContent = container.querySelector('#tabContent');
    loadUsersTable(users, $tabContent);
    ///Llamamos a renderPagination para que siempre pues vaya cambiando en base a la pagina y numero en el cual se encuentre al hacer reload
    renderPagination(data.number, data.totalPages, container);  
  } catch (e) {
    console.error(e);
  }
}


///Funcion para renderizar los datos asi como los eventos de nuestro formulario
async function renderData(container) {
  ///Variables con nuestro tabList y el contenido(nuestra tabla)
  const $tabList = container.querySelector('#tabList');
  const $tabContent = container.querySelector('#tabContent');
  ///Array donde se guardan los usuarios
  let users = [];

  ///Llenamos los usuarios
  try {
    ///traemos el json en data
    const data = await UserService.getUsers(currentPage, currentSize);
    ///Accedemos al content de eso 
    users = data.content;
    ///Llamamos al renderPagination para que carge cuando inicie todo
    renderPagination(data.number, data.totalPages, container)
  } catch (error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se pudieron cargar los usuarios.</p>`;
  }

  ///Aca definimos nuestros tabs y de igual forma a donde estan dirigidos, puedes definir varios en page, y cada uno debe tener su div con ru ID 
  $tabList.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#usuarios">Usuarios</a>
        </li>`;

  ///Cargamos datos, pasamos nuestros usuarios y nuestro contenedor
  loadUsersTable(users, $tabContent);

  const sizeSelector = document.getElementById("itemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-user');
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await UserService.deleteUser(id);
    ///En caso de que nos devuelva un true recargamos
    if (ok) await reload(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener('click', async e => {
    const editBtn = e.target.closest('.btn-edit-user');
    if (!editBtn) return;
    const id = editBtn.dataset.id;
    try {
      const user = await UserService.getUserById(id);
      document.getElementById('idtxt').value = user.idUser ?? '';
      document.getElementById('nombretxt').value = user.firstName ?? '';
      document.getElementById('apellidotxt').value = user.lastName ?? '';
      document.getElementById('usuariotxt').value = user.username ?? '';
      document.getElementById('correoElectronicotxt').value = user.email ?? '';
      document.getElementById('roltxt').value = user.idRol ?? '';
    } catch (err) {
      Alerts.showToastCloseError('No se pudo cargar el usuario');
      console.error(err);
    }
  });
}

///Aca cargamos nuestros usuarios, nada nuevo, eso si en lugar del id mandamos un numero, por que pues si, usamos RAW, xdnt
export function loadUsersTable(users, tab) {
  ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
    <div id="usuarios" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Correo</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerUsers">
            ${users
              .map(
                (u, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${u.firstName} ${u.lastName}</td>
                <td>${u.username}</td>
                <td>${u.nameRol}</td>
                <td>${u.email}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-user" data-id="${
                      u.idUser
                    }" data-bs-toggle="modal" data-bs-target="#usersModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-user" data-id="${
                      u.idUser
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

///Aca llenamos nuestros roles, la funcionalidad esta en page
export function loadRoles(roles, rolSelect) {
  roles.forEach(element => {
    rolSelect.innerHTML += `
        <option value="${element.idRol}">${element.name}</option>
      `
  });
}

///!IMPORTANTE: con el tema del idRol nosotros aca usamos el .value, en el page, pasamos el select entero
///Aca hacemos la funcionalidad del insert, su uso esta en page
export async function insertUser(usertxt, nametxt, lastNametxt, emailtxt, rolId, form) {
  const payload = {
    idRol: rolId.value,
    username: usertxt.value.trim(),
    firstName: nametxt.value.trim(),
    lastName: lastNametxt.value.trim(),
    email: emailtxt.value.trim(),
    userPassword: generateRandomPassword().trim()
  }
  try {
    const res = await UserService.insertUser(payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar al usuario ${err}`);
    ///Retornamos un false
    return { ok: false };
  }
}

///Lo mismo que el insert pero ahora update,
export async function updateUser(usertxt, nametxt, lastNametxt, emailtxt, roltxt, form, id) {
  const payload = {
    idUser: id.value,
    idRol: roltxt.value,
    username: usertxt.value.trim(),
    firstName: nametxt.value.trim(),
    lastName: lastNametxt.value.trim(),
    email: emailtxt.value.trim(),
  }
  try {
    ///Hacemos la peticion
    const res = await UserService.updateUser(payload, id);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError("No se pudo actualizar el usuario");
    ///Retornamos un false
    return { ok: false };
  }
}

export function renderPagination(current, totalPages, container) {
  ///Aca accedemos a nuestro ul de pagination
  const pagination = document.getElementById("userPagination");
  if (!pagination) return;
  pagination.innerHTML = "";///Limpiamos la paginacion previa


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
      currentPage = current - 1;///Retrocede una pagina
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
      currentPage = current + 1;///Avanza una pagina
      reload(container);
    }
  });
  pagination.appendChild(next);
}


///Funcion para generar contrasenia aleatoria
function generateRandomPassword(length = 8) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789' +
    '!@#$%^&*()_-+={}[]';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * charset.length);
    password += charset[randIndex];
  }
  let castPassword = toString(password);
  return castPassword;
}

