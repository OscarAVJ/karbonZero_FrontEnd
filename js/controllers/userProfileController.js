import * as UserService from "../services/userService.js";
import * as Alerts from "../../utils/alerts.js";

export async function reloadUserData(userId) {
  try {
    const user = await UserService.getUserById(userId);
    document.querySelector(
      "#profile-name"
    ).textContent = `${user.firstName} ${user.lastName}`;
    document.querySelector(
      "#profile-username"
    ).textContent = `@${user.username}`;
    document.querySelector("#profile-email").textContent = user.email;
  } catch (err) {
    console.error(err);
  }
}

export async function confirmPassword(idUser, password) {
    try {
        const result = await UserService.confirmPassword(idUser, password);
        return result.authenticated;
    } catch (err) {
        return false;
    }
    
}

export async function loadUserModal(
  userId,
  firstNametxt,
  lastNametxt,
  userNametxt,
  emailtxt
) {
  try {
    const user = await UserService.getUserById(userId);
    firstNametxt.value = user.firstName;
    lastNametxt.value = user.lastName;
    userNametxt.value = user.username;
    emailtxt.value = user.email;
  } catch (err) {
    console.error(err);
  }
}

export async function updateProfile(
  firstNametxt,
  lastNametxt,
  userNametxt,
  emailtxt,
  form,
  userId
) {
  const user = await UserService.getUserById(userId);
  const payload = {
    idUser: userId,
    idRol: user.idRol,
    username: userNametxt.value.trim(),
    firstName: firstNametxt.value.trim(),
    lastName: lastNametxt.value.trim(),
    email: emailtxt.value.trim(),
  };
  try {
    ///Hacemos la peticion
    const res = await UserService.updateUser(payload, userId);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError("No se pudo actualizar el usuario");
    return {ok: false}
  }
}

export async function updatePassword(
  password,
  form,
  userId
) {
  const user = await UserService.getUserById(userId);
  const payload = {
    idUser: userId,
    idRol: user.idRol,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userPassword: password
  };
  try {
    ///Hacemos la peticion
    const res = await UserService.updateUser(payload, userId);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError("No se pudo actualizar la contraseña");
    return { ok: false };
  }
}
