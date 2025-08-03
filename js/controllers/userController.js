import * as UserService from '../services/userService.js';
//!Importamos todas las funciones de nuestro userService.js
import * as Alerts from '../../utils/alerts.js'

export async function init(container) {
  getData(container);

}
async function getData(container) {
  const $tabList = container.querySelector('#tabList');
  const $tabContent = container.querySelector('#tabContent');
  let users = [];

  try {
    users = await UserService.getUsers();
  } catch (error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se pudieron cargar los usuarios.</p>`;
  }
  $tabList.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#usuarios">Usuarios</a>
        </li>`;
  LoadTable(users, container.querySelector('#tabContent'));
  const tbody = container.querySelector('#tabContent tbody');

  tbody.addEventListener('click', async e => {
    const btn = e.target.closest('#delete-user-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    try {
      await UserService.deleteUser(id);
      let users2 = [];
      users2 = await UserService.getUsers();
      LoadTable(users2, $tabContent);
    } catch (err) {
      Alerts.showInfo("Error eliminando al usuario", `${err}`, "error")
    }
  })
}


function LoadTable(users, tab) {
  tab.innerHTML = `
    <div id="usuarios" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${u.firstName} ${u.lastName}</td>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#usersModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger" id="delete-user-btn" data-id="${u.idUser}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

export async function insertUser(usertxt, nametxt, lastNametxt, emailtxt, form) {
  const payload = {
    idRol: "AC20B5AC01CC4E4CBD6028326BD053EA",
    username: usertxt.value.trim(),
    firstName: nametxt.value.trim(),
    lastName: lastNametxt.value.trim(),
    email: emailtxt.value.trim(),
    //TODO: Mandarle la contraseña al usuario al correo
    userPassword: generateRandomPassword().trim()
  }
  try {
    UserService.insertUser(payload);
    UserService.getUsers();
    console.log(payload);
  } catch (err) {
    console.error("No se pudo insertar el usuario")
  }
  form.reset();
}
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