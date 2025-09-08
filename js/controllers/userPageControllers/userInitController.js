import { initUser } from "./userController.js";
import { initRol } from "./rolController.js";

export async function initAllUsersTabs(container) {
  const $tabListR = container.querySelector("#tabList");
  //! En el href nosotros ponemos el id del tab al cual vamos a llenar con load xxxx
  $tabListR.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#users">Usuarios</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#roles">Roles</a>
        </li>
    `;
  initUser(container);
  initRol(container);
}
