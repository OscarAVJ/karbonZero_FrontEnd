import * as UserService from '../services/userService.js';
import * as Alerts from '../../utils/alerts.js'
///Con import podemos acceder a todos los metodos exportados de X archivo


///Nuestro metodo de inicio, lo llamamos en el userPage.js
export async function init(container) {
  ///Mandamos el contenedor junto con nuestro metodo init
  renderData(container);
}

///Aca esta nuestro metodo reload y pues container sera igual al contenedor que le estemos pasando en este caso el final en page va a ser el de usuarios 
export async function reload(container) {
  ///Si nuestro container es nulo....
  if (!container) return;
  ///Si no pues hacemos una peticion get y le pasamos ese array de usuarios + el tab donde queremos poner la grid
  try {
    const users = await UserService.getUsers();
    const $tabContent = container.querySelector('#tabContent');
    LoadTable(users, $tabContent);
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
    users = await UserService.getUsers();
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
  LoadTable(users, $tabContent);

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
export function LoadTable(users, tab) {
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
            ${users.map((u, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${u.firstName} ${u.lastName}</td>
                <td>${u.username}</td>
                <td>${u.nameRol}</td>
                <td>${u.email}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-user" data-id="${u.idUser}" data-bs-toggle="modal" data-bs-target="#usersModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-user" data-id="${u.idUser}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
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

