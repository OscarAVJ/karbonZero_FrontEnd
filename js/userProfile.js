function initUserProfile(){

//TODO: Llamada al get
    initModalProfile();
}
function initModalProfile() {
  const modalEl = document.getElementById('profileModal');
  const modalContra = document.getElementById('contraseñaModal')
  if (!modalEl || !modalContra) return;
  /// si ya existía, getOrCreateInstance no crea una nueva
  window.consumptionsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  window.contraModal = bootstrap.Modal.getOrCreateInstance(modalContra);

}
///TODO: ACA IRA LA LOGICA DEL POST 
document.getElementById('userPForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('purezatxt');
  console.log(text)
  window.consumptionsModal.hide();
});