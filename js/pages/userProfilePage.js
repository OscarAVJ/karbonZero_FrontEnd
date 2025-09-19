import * as UserProfileController from "../controllers/userProfileController.js";
import * as Alerts from "../../utils/alerts.js";
import * as imageService from "../services/imageService.js"

export async function render() {
  loadCSS();
  return `
        <div class=" py-4">
        <h2 class="general-title">
            Perfil de usuario
        </h2>
        <div class="advanced-filters-container p-4 mb-3">
            <div class="profile-card row align-items-center g-3">
                <div class="col-12 col-md-auto text-center">
                    <img id="profile-img"
                        src=""
                        alt="Foto de perfil" class="rounded-circle img-fluid"
                        style="width: 100px; height: 100px; object-fit: cover;" />
                </div>
                <div class="col-12 col-md">
                    <div class="text-md-start text-center">
                        <h4 class="fw-bold m-0" id="profile-name">Jhon Doe</h4>
                        <p class="text-muted mb-1" id="profile-username">@jhon</p>
                        <p class="fw-semibold mb-2" id="profile-email" style="text-wrap:inherit;">email@email.com</p>
                    </div>
                </div>
                <div class="col-12 col-md-auto text-md-end text-center">
                    <button class="btn btn-success kz-button-create px-4 w-100 w-md-auto" data-bs-target="#profileModal"
                        data-bs-toggle="modal" id="editProfile">Editar perfil</button>
                </div>
            </div>
        </div>
        <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content kz-modal-mongo border-0">
                    <div class="modal-header" style="justify-content: center; position: relative;">
                        <h4 class="kz-modal-title" id="exampleModalLongTitle">Perfil</h4>
                        <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                            data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <form id="userPForm">
                        <div class="modal-body mx-3">
                            <div class="col mb-2">
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Nombre">
                            </div>
                            <div class="col mb-2">
                                <label for="apellidotxt" class="form-label">Apellido</label>
                                <input type="text" id="apellidotxt" class="form-control" placeholder="Apellido">
                            </div>
                            <div class="col mb-2">
                                <label for="usuariotxt" class="form-label">Usuario</label>
                                <input type="text" id="usuariotxt" class="form-control" placeholder="Usuario">
                            </div>
                            <div class="col mb-2">
                                <label for="correoElectronicotxt" class="form-label">Correo electrónico</label>
                                <input type="email" id="correoElectronicotxt" class="form-control" placeholder="Correo">
                            </div>
                            <div class="col mb-2">
                                <label for="fileImg" class="form-label">Foto de perfil</label>
                                <input type="file" id="fileImg" accept="image/*" />
                            </div>
                            <div class="col mb-2" d-none>
                                <input type="hidden"  id="urlImg" class="form-control" placeholder="Url" >
                            </div>
                        </div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button type="submit" class="btn kz-button-create">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="advanced-filters-container p-4">
            <h4 class="fw-bold mb-3">Apariencia</h4>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="fw-semibold">Modo oscuro</span>
                <div class="form-check form-switch m-0">
                    <input type="checkbox" id="darkModeToggle" class="custom-switch-xl">
                </div>
            </div>
            <div class="mb-4">
                <label for="languageSelect" class="fw-semibold mb-1">Idioma</label>
                <select id="languageSelect" class="form-select">
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
            </div>
            <button class="btn btn-success kz-button-create w-100" data-bs-toggle="modal"
                data-bs-target="#contraseñaModal" id="editPassword">Cambiar contraseña</button>
        </div>
        <div class="modal fade" id="contraseñaModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content kz-modal-mongo border-0">
                    <div class="modal-header" style="justify-content: center; position: relative;">
                        <h4 class="kz-modal-title" id="exampleModalLongTitle">Cambiar contraseña</h4>
                        <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                            data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <form id="contraseñaForm">
                        <div class="modal-body mx-3">
                            <div class="col mb-2">
                                <label for="viejaContratxt" class="form-label">Contraseña actual</label>
                                <div class="input-group">
                                    <input id="viejaContratxt" type="password" class="form-control" placeholder="Contraseña actual" required>
                                    <button class="btn" type="button" id="hideOldPassword"><i class="bi bi-eye-fill"></i></button>
                                </div>
                            </div>
                            <div class="col mb-2">
                                <label for="nuevaContratxt" class="form-label">Nueva contraseña</label>
                                <div class="input-group">
                                    <input type="password" id="nuevaContratxt" class="form-control" placeholder="Nueva contraseña" required>
                                    <button class="btn" type="button" id="hideNewPassword"><i class="bi bi-eye-fill"></i></button>
                                </div>
                            </div>
                            <div class="col mb-2">
                                <label for="confirmarContratxt" class="form-label">Confirmar contraseña</label>
                                <input type="password" id="confirmarContratxt" class="form-control" placeholder="Confirmar contraseña" required>
                            </div>
                        </div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button type="submit" class="btn kz-button-create">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>


  `;
}
export function afterRender() {
  loadUserData();
}

function loadCSS() {
  const id = "reports-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../css/userProfile.css";
    link.id = id;
    document.head.appendChild(link);
  }
}

function loadUserData() {
  const firstNametxt = document.querySelector("#nombretxt");
  const lastNametxt = document.querySelector("#apellidotxt");
  const usertxt = document.querySelector("#usuariotxt");
  const emailtxt = document.querySelector("#correoElectronicotxt");
  
  const editProfileBtn = document.querySelector("#editProfile");
  const editProfileModal = document.querySelector("#profileModal");
  const profileModal = bootstrap.Modal.getOrCreateInstance(editProfileModal);
  const editProfileForm = document.querySelector("#userPForm");

  const editPasswordBtn = document.querySelector("#editPassword");
  const editPasswordModal = document.querySelector("#contraseñaModal");
  const passwordModal = bootstrap.Modal.getOrCreateInstance(editPasswordModal);
  const editPasswordForm = document.querySelector("#contraseñaForm");

  const oldPassword = document.querySelector("#viejaContratxt");
  const newPassword = document.querySelector("#nuevaContratxt");
  const confirmPassword = document.querySelector("#confirmarContratxt");

  const hideOPassword = document.querySelector("#hideOldPassword");
  const hideOPIcon = hideOPassword.getElementsByTagName("i")[0];
  const hideNPassword = document.querySelector("#hideNewPassword");
  const hideNPIcon = hideNPassword.getElementsByTagName("i")[0];

  const imageFileInput = document.getElementById("fileImg");
  const imageUrlHidden = document.getElementById("urlImg");
  const imagePreview = document.getElementById("profile-image")

  UserProfileController.reloadUserData(localStorage.getItem("user"));

    if(imageFileInput && imagePreview){
        imageFileInput.addEventListener("change", ()=>{
            const file = imageFileInput?.[0];
            if(file){
                const reader = new FileReader();
                render.onload = () => (imagePreview.src = render.result);
                render.readAsDataURL(file);
            } else{
                imagePreview.src = imageUrlHidden?.value || "";
            }
        });
    }

  // Logica para cargar el formulario de actualizar perfil
  editProfileBtn.addEventListener("click", () => {
    UserProfileController.loadUserModal(
      localStorage.getItem("user"),
      firstNametxt,
      lastNametxt,
      usertxt,
      emailtxt
    );
  });

  // Lógica para actualizar el perfil
  let isLoadingProfile = false;
  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!usertxt.value) {
        Alerts.showToastCloseError("El nombre de usuario es obligatorio");
        return;
    }

    if (!emailtxt.value) {
        Alerts.showToastCloseError("El correo electrónico es obligatorio");
        return;
    }

    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailtxt.value.match(re)) {
        Alerts.showToastCloseError("El correo electrónico no tiene una estructura válida");
        return;
    }

     let finalImageURL = imageUrlHidden?.value || "";
    const file = imageFileInput?.files?.[0];

    if(file){
        try{
            const data = await imageService.uploadImageToFolder(file, "profileImage")
            finalImageURL = data.url || ""
        }
        catch (err){
            console.error("Error subiendo imagenes:" , err)
             Alerts.showToastCloseError("No ha sido posible editar la foto de perfil");
             return;
        }
    }
    
    if (isLoadingProfile) return;
    isLoadingProfile = true;

    let res = await UserProfileController.updateProfile(
      firstNametxt,
      lastNametxt,
      usertxt,
      emailtxt,
      finalImageURL,
      editProfileForm,
      localStorage.getItem("user")
    );

    profileModal.hide();
    isLoadingProfile = false;

    if (res?.ok) {
        await UserProfileController.reloadUserData(localStorage.getItem("user"));
    };    
  });

  // Botones para mostrar constraseña
  hideOPassword.addEventListener("click", (e) => {
    if (hideOPIcon.className == "bi bi-eye-fill") {
      hideOPIcon.className = "bi bi-eye-slash-fill";
      oldPassword.setAttribute("type", "text");
    } else {
      hideOPIcon.className = "bi bi-eye-fill";
      oldPassword.setAttribute("type", "password");
    }
  });
  hideNPassword.addEventListener("click", (e) => {
      if (hideNPIcon.className == "bi bi-eye-fill") {
        hideNPIcon.className = "bi bi-eye-slash-fill";
        newPassword.setAttribute("type", "text");
      } else {
        hideNPIcon.className = "bi bi-eye-fill";
        newPassword.setAttribute("type", "password");
      }
    });

  // Lógica para actualizar la contraseña
  let isLoadingPassword = false;
  editPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!oldPassword.value.trim() || !newPassword.value.trim() || !confirmPassword.value.trim()) {
        Alerts.showToastCloseError("Todos los campos son requeridos");
        return;
    }

    const valid = await UserProfileController.confirmPassword(localStorage.getItem("user"), oldPassword.value.trim())
    if (!valid) {
      Alerts.showToastCloseError("La contraseña no es correcta");
      return;
    }

    if (newPassword.value.trim() !== confirmPassword.value.trim()) {
        Alerts.showToastCloseError("Las contraseñas nuevas no coinciden");
        return;
    }

    if (isLoadingPassword) return;
    isLoadingPassword = true;

    await UserProfileController.updatePassword(newPassword.value.trim(), editPasswordForm, localStorage.getItem("user"))

    passwordModal.hide()
    isLoadingPassword = false;
    Alerts.showToastCloseInfo("Contraseña actualizada");
  })
}
