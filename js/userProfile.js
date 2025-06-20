function initUserProfile(){

//TODO: Llamada al get
    initModalProfile();
}
function initModalProfile() {
  const modalEl = document.getElementById('profileModal');
  if (!modalEl) return;
  /// si ya existía, getOrCreateInstance no crea una nueva
  window.consumptionsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
}
///TODO: ACA IRA LA LOGICA DEL POST 
document.getElementById('userPForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('purezatxt');
  console.log(text)
  window.consumptionsModal.hide();
});