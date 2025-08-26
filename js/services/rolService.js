import * as Alerts from '../../utils/alerts.js'
import { APIURL as API_URL } from "../../utils/api_url";

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getAllRolesList () {
    try {
        const response = await fetch(`${API_URL}apiUser/getAllRolesList`);
        if (!response.ok) {
            console.error("Error fetching roles");
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching roles ${error}`);
        throw error;
    }
}

export async function getAllRoles(currentPage=0, currentSize=10) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        const response = await fetch(
          `${API_URL}apiUser/getAllRoles?page=${currentPage}&size=${currentSize}`
        );
        ///Si esta malo pues aja, mandamos error
        if (!response.ok) {
            console.error("Error fetching roles");
        }
        ///Retornamos la respuesta en formato json
        return response.json();
    } catch (error) {
        console.error(`Error fetching roles: ${error}`)
        throw error;
    }
}