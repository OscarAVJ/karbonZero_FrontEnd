import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from '../../utils/alerts.js'

///Exporamos la funcion para poder importarla en nuestro controlador
export async function getUsers( page = 0, size = 10) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        const response = await fetch(`${API_URL}apiUser/getAllUsers?page=${page}&size=${size}`);
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

///Metodo para insertar usuarios, le pasamos payload como parametro
export async function insertUser(payload) {
    try {
        const response = await fetch(`${API_URL}apiUser/insertUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        ///Transformamos la data a json 
        const data = await response.json();

        if (response.ok) {
            Alerts.showToastCloseSuccess("Usuario creado exitosamente");
        } else {
            Alerts.showToastCloseError(`Error creando usuario ${response.status}`);
        }
        ///Retornamos un ok en true y pues la data ya en formato json 
        return { ok: true, data };
    } catch (err) {
        Alerts.showToastCloseError(`Error creando usuario ${err}`);
        ///False, la data en null y su error respectivo
        return { ok: false, data: null, error: err };
    }
}

///Metodo para acualizar, pero aca le pasamos el id tambien y en el parametro de la Url es importante que sea id.value si no pues no va a funcionar
export async function updateUser(payload, id) {
    try {
        const response = await fetch(`${API_URL}apiUser/updateUser/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);

        if (response.ok) {
            Alerts.showToastCloseSuccess("Usuario actualizado exitosamente");
        } else {
            Alerts.showToastCloseError(`Error actualizando usuario`);
        }
        ///Enviamos un estado de ok en true y de igual forma la data
        return { ok: true, data };
    } catch (err) {
        Alerts.showToastCloseError(`Error actualizando usuario ${err}`);
        ///Enviamos un false data en null y su respectivo error
        return { ok: false, data: null, error: err };
    }
}

export async function deleteUser(id) {
    ///Aca le preguntamos al usuario si quiere eliminar y pues su valor dependera de si acepta o no, tipo un alert
    const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este usuario?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: "Cancelar"
    });
    ///Si el man cancela el proceso
    if (!result.isConfirmed) {
        return false;
    }
    ///Y ya el delete, ya se la saben
    try {
        ///Peticion
        const resp = await fetch(`${API_URL}apiUser/deleteUser/${id}`, { method: 'DELETE' });
        ///Ahi un return en caso de error
        if (!resp.ok) {
            Alerts.showToastCloseError("No se pudo eliminar el usuario");
            return false;
        }
        ///Si todo bien mandamos el success
        Alerts.showToastCloseSuccess("Usuario eliminado exitosamente");
        return true;
    } catch (e) {
        ///En caso de error
        Alerts.showToastCloseError("Error eliminando usuario");
        return false;
    }
}
