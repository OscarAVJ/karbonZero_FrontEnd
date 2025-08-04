import * as Alerts from '../../utils/alerts.js'
import { APIURL as API_URL } from "../../utils/api_url";

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getRoles() {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        ///!Hacemos el get, nada nuevo
        const response = await fetch(`${API_URL}apiUser/getAllRoles`);
        ///Si esta malo pues aja, mandamos error
        if (!response.ok) {
            Alerts.showToastCloseError("Error cargando roles")
        }
        ///Retornamos la respuesta en formato json
        return response.json();
    } catch (error) {
        Alerts.showToastCloseError(`Error cargando roles ${error}`)
        throw error;
    }
}