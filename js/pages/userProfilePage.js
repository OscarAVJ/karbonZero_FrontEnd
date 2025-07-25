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
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&s"
                        alt="Foto de perfil" class="rounded-circle img-fluid"
                        style="width: 100px; height: 100px; object-fit: cover;" />
                </div>
                <div class="col-12 col-md">
                    <div class="text-md-start text-center">
                        <h4 class="fw-bold m-0" id="profile-name">Joaquín Magaña</h4>
                        <p class="text-muted mb-1" id="profile-username">@joaquín</p>
                        <p class="fw-semibold mb-2" id="profile-email" style="text-wrap:inherit;">joaquin@ricaldone.edu.sv</p>
                    </div>
                </div>
                <div class="col-12 col-md-auto text-md-end text-center">
                    <button class="btn btn-success kz-button-create px-4 w-100 w-md-auto" data-bs-target="#profileModal"
                        data-bs-toggle="modal">Editar perfil</button>
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
                                <label for="usuariotxt" class="form-label">Apellido</label>
                                <input type="text" id="usuariotxt" class="form-control" placeholder="Apellido">
                            </div>
                            <div class="col mb-2">
                                <label for="correoElectronicotxt" class="form-label">Correo electrónico</label>
                                <input type="email" id="correoElectronicotxt" class="form-control" placeholder="Correo">
                            </div>
                            <div class="col mb-2">
                                <label for="fileImg" class="form-label">Foto de perfil</label>
                                <input type="file" id="fileImg" accept="image/*" />
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
                data-bs-target="#contraseñaModal">Cambiar contraseña</button>
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
                                <label for="nombretxt" class="form-label">Contraseña actual</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Contraseña actual">
                            </div>
                            <div class="col mb-2">
                                <label for="nuevaContratxt" class="form-label">Nueva contraseña</label>
                                <input type="text" id="nuevaContratxt" class="form-control" placeholder="Nueva contraseña"
                                    disabled>
                            </div>
                            <div class="col mb-2">
                                <label for="correoElectronicotxt" class="form-label">Confirmar contraseña</label>
                                <input type="email" id="correoElectronicotxt" class="form-control"
                                    placeholder="Confirmar contraseña" disabled>
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
}

function loadCSS() {
  const id = 'reports-css';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../../css/userProfile.css'; 
    link.id = id;
    document.head.appendChild(link);
  }
}
