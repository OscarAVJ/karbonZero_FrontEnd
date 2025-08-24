import * as Alerts from '../../utils/alerts.js'
import { APIURL } from '../../utils/api_url.js';

export async function getAllMeasureUnitsList() {
    try {
        const response = await fetch(`${APIURL}apiMeasure/getAllMeasureUnitsList`);
        if (!response.ok) {
            console.error("Error fetching measure units");
        }
        return response.json();
    } catch (error) {
        console.error (`Error fetching measure units: ${error}`);
    }
}

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getAllMeasureUnits(currentPage=0, currentSize=10) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        ///!Hacemos el get, nada nuevo
        const response = await fetch(
          `${APIURL}apiMeasure/getAllMeasureUnits?page=${currentPage}&size=${currentSize}`
        );
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

///Aca pues este es Muy Importante para el put, asi que si su CRUD no lo tiene, haganlo.
export async function getMeasureUnitById(id) {
    ///Try para intentar
    try {
        ///Hacemos la peticion a la api
        const response = await fetch(`${APIURL}apiMeasure/getMeasureUnitById/${id}`);
        ///Guardamos la respuesta en una variable, por que pues solo es uno va, u hace referencia usuario
        const u = await response.json();
        ///lo mismo de arriba
        if (!response.ok) {
            throw new Error(`Error cargando unidades de medida: ${response.status}`);
        }
        return u;
    ///Ya lo saben
    } catch (error) {
        console.error("Error cargando unidades de medida:", error);
        throw error;
    }
}

///Funcion para insertar usuarios, (Peticion)
export async function insertMeasureUnit(payload) {
    ///Try
    try {
        ///Peticion para el insert y como lo queremos asi como su metodo
        const response = await fetch(`${APIURL}apiMeasure/insertMeasureUnit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            ///Convertimos la respuesta a json
            body: JSON.stringify(payload)
        });
        ///Si esta bueno mandamos una alerta buena
        if (response.ok) {
            Alerts.showToastCloseSuccess("Unidad de medida creada exitosamente")
        }
        ///Si no pues una mala
        else {
            Alerts.showToastCloseError(`Error creando unidad de medida ${response.status}`)
        }
        ///Retornamos nuestra respuesta
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error creando unidad de medida ${err}`)
    }
}

///Peticion para actualizar Recurso
///IMPORTANTE: QUE EN LA PETICION EL ID.VALUE 
export async function updateMeasureUnit(payload, id) {
    ///Try
    try {
        ///Peticion para actualizar recurso
        const response = await fetch(`${APIURL}apiMeasure/updateMeasureUnit/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            ///lo hacemos json
            body: JSON.stringify(payload)
        })
        ///Lo mismo que esta en insertResource, suban
        if (response.ok) {
            Alerts.showToastCloseSuccess("Unidad de medida actualizada exitosamente")
        }
        else {
            Alerts.showToastCloseError(`Error actualizando unidad de medida`)
        }
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error actualizando unidad de medida ${err}`)
    }

}
///Aca esta el delete
export async function deleteMeasureUnit(id) {
    ///Le pedimos una confirmacion al usuario 
    Swal.fire({
        title: "¿Estas seguro de que quieres eliminar a esta unidad de medida?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: `Cancelar`
    }).then(async (result) => {
        ///Si el usuario acepta hacemos la peticion
        if (result.isConfirmed) {
            await fetch(`${APIURL}apiMeasure/deleteMeasureUnit/${id}`, {
                method: 'DELETE'
            });
            Alerts.showToastCloseSuccess("Unidad de medida eliminada exitosamente")
        } else if (result.isDenied) {
            Alerts.showToastCloseError("Proceso cancelado")
            return;
        }
    });
}