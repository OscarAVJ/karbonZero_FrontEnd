import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from '../../utils/alerts.js'

///Exporamos la funcion para poder importarla en nuestro controlador
export async function getUsers() {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        const response = await fetch(`${API_URL}apiUser/getAllUsers`);
        ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
        if (!response.ok) {
            throw new Error(`Error cargando users: ${response.status}`);
        }
        ///Finalmente retornamos nuestra respuesta en formato json
        return response.json();
        ///Ya el catch, supongo que ya se la saben ok
    } catch (error) {
        console.error("Error cargando users:", error);
        throw error;
    }
}

///Aca pues este es Muy Importante para el put, asi que si su CRUD no lo tiene, haganlo.
export async function getUserById(id) {
    ///Try para intentar
    try {
        ///Hacemos la peticion a la api
        const response = await fetch(`${API_URL}apiUser/getUserById/${id}`);
        ///Guardamos la respuesta en una variable, por que pues solo es uno va, u hace referencia usuario
        const u = await response.json();
        ///lo mismo de arriba
        if (!response.ok) {
            throw new Error(`Error cargando users: ${response.status}`);
        }
        return u;
    ///Ya lo saben
    } catch (error) {
        console.error("Error cargando users:", error);
        throw error;
    }
}

///Funcion para insertar usuarios, (Peticion)
export async function insertUser(payload) {
    ///Try
    try {
        ///Peticion para el insert y como lo queremos asi como su metodo
        const response = await fetch(`${API_URL}apiUser/insertUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            ///Convertimos la respuesta a json
            body: JSON.stringify(payload)
        });
        ///Si esta bueno mandamos una alerta buena
        if (response.ok) {
            Alerts.showToastCloseSuccess("Usuario creado exitosamente")
        }
        ///Si no pues una mala
        else {
            Alerts.showToastCloseError(`Error creando usuario ${response.status}`)
        }
        ///Retornamos nuestra respuesta
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error creando usuario ${err}`)
    }
}

///Peticion para actualizar Usuario
///IMPORTANTE: QUE EN LA PETICION EL ID.VALUE 
export async function updateUser(payload, id) {
    ///Try
    try {
        ///Peticion para actualizar usuario
        const response = await fetch(`${API_URL}apiUser/updateUser/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            ///lo hacemos json
            body: JSON.stringify(payload)
        })
        ///Lo mismo que esta en insertUser, suban
        if (response.ok) {
            Alerts.showToastCloseSuccess("Usuario actualizado exitosamente")
        }
        else {
            Alerts.showToastCloseError(`Error actualizando usuario`)
        }
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error actualizando usuario ${err}`)
    }

}
///Aca esta el delete
export async function deleteUser(id) {
    ///Le pedimos una confirmacion al usuario 
    Swal.fire({
        title: "Estas seguro de que quieres eliminar a este usuario?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: `Cancelar`
    }).then(async (result) => {
        ///Si el usuario acepta hacemos la peticion
        if (result.isConfirmed) {
            await fetch(`${API_URL}apiUser/deleteUser/${id}`, {
                method: 'DELETE'
            });
            Alerts.showToastCloseSuccess("Usuario eliminado exitosamente")
        } else if (result.isDenied) {
            Alerts.showToastCloseError("Proceso cancelado")
            return;
        }
    });
}