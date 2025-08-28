import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from '../../utils/alerts.js'

///Exporamos la funcion para poder importarla en nuestro controlador
export async function getAllUsers(page= 0, size=10) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        const response = await fetch(`${API_URL}apiUser/getAllUsers?page=${page}&size=${size}`);
        ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
        if (!response.ok) {
            console.error(`Error fetching users`);
        }
        ///Finalmente retornamos nuestra respuesta en formato json
        return response.json();
        ///Ya el catch, supongo que ya se la saben ok
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
        throw error;
    }
}

export async function getAllUsersByUsername(searchName, page = 0, size = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiUser/getUsersByUsername/${searchName}?page=${page}&size=${size}`
    );
    ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
    if (!response.ok) {
      console.error(`Error fetching users`);
    }
    ///Finalmente retornamos nuestra respuesta en formato json
    return response.json();
    ///Ya el catch, supongo que ya se la saben ok
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
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
            console.error(`Error fetching user`);
        }
        return u;
        ///Ya lo saben
    } catch (error) {
        console.error(`Error fetching user: ${error}`);
        throw error;
    }
}

export async function confirmPassword(idUser, password) {
    try {
        const response = await fetch(
          `${API_URL}apiUser/confirmPassword?idUser=${idUser}&password=${password}`,
          {
            method: "POST"
          }
        );

        if (!response.ok) {
            console.error("Error confirming password");
        }
        return response.json();
    } catch (err) {
        console.error(`Error confirming password: ${err}`);
        throw err;
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
        
        if (response.ok) {
            Alerts.showToastCloseSuccess("Usuario creado exitosamente");
        } else {
            console.error(`Error creating user: ${response.status}`);
        }
        
        const data = await response.json();
        return { ok: true, data };
    } catch (err) {
        console.error(`Error creating user: ${err}`);
        return { ok: false, data: null, error: err };
    }
}



///Metodo para acualizar, pero aca le pasamos el id tambien y en el parametro de la Url es importante que sea id.value si no pues no va a funcionar
export async function updateUser(payload, id) {
    try {
        const response = await fetch(`${API_URL}apiUser/updateUser/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            Alerts.showToastCloseSuccess("Usuario actualizado exitosamente");
        } else {
            console.error(`Error updating user: ${response.status}`);
        }
        
        const data = await response.json();
        return { ok: true, data};
    } catch (err) {
        console.error(`Error updating user: ${err}`);
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
        const response = await fetch(`${API_URL}apiUser/deleteUser/${id}`, { method: 'DELETE' });
        ///Ahi un return en caso de error
        if (!response.ok) {
            console.error(`Error deleting user: ${response.status}`);
            return false;
        }
        ///Si todo bien mandamos el success
        Alerts.showToastCloseSuccess("Usuario eliminado exitosamente");
        return true;
    } catch (err) {
        ///En caso de error
        Alerts.showToastCloseError(`Error deleting user: ${err}`);
        return false;
    }
}
