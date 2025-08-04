import * as Alerts from '../../utils/alerts.js'
import { APIURL } from '../../utils/api_url.js';


///Exportamos la funcion para poder importarla en nuestro controlador
export async function getMeasureUnits() {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        ///!Hacemos el get, nada nuevo
        const response = await fetch(`${APIURL}apiMeasure/getAllMeasureUnits`);
        ///Si esta malo pues aja, mandamos error
        if (!response.ok) {
            Alerts.showToastCloseError("Error cargando unidades de medida")
        }
        ///Retornamos la respuesta en formato json
        return response.json();
    } catch (error) {
        Alerts.showToastCloseError(`Error cargando unidades de medida ${error}`)
        throw error;
    }
}