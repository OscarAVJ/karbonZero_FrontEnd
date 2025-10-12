import { verifyRecoveryCode, putUser } from './userService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('passwordRecoveryForm');
  const codeInput = document.getElementById('recoveryCode');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const code = codeInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const email = localStorage.getItem('recoveryEmail'); // obtenemos el correo usado

    if (!code || !newPassword || !confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Verificamos el código con el backend
      const verifyRes = await verifyRecoveryCode(code);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        alert(verifyData.message || 'Código inválido o expirado.');
        return;
      }

      // Crear payload con los datos que el backend necesita
      const payload = {
        idUser: verifyData.idUser, // si tu API devuelve el ID del usuario
        email: email,
        passwordUser: newPassword
      };

      const resetRes = await putUser(payload);
      if (resetRes.ok) {
        alert('Contraseña actualizada correctamente.');
        localStorage.removeItem('recoveryEmail');
        document.getElementById('passwordRecoveryModal').querySelector('form').reset();
        // Si querés cerrar el modal automáticamente:
        const modal = bootstrap.Modal.getInstance(document.getElementById('passwordRecoveryModal'));
        modal.hide();
      } else {
        alert(resetRes.data?.message || 'No se pudo actualizar la contraseña.');
      }

    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      alert('Ocurrió un error inesperado.');
    }
  });
});
