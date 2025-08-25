import * as Alerts from '../../utils/alerts.js'
import { APIURL as API_URL } from '../../utils/api_url.js';


///Exportamos la funcion para poder importarla en nuestro controlador
export async function getAllConversionUnits(currentPage=0, currentSize=10) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        ///!Hacemos el get, nada nuevo
        const response = await fetch(
          `${API_URL}apiMeasure/getAllConversionUnits?page=${currentPage}&size=${currentSize}`
        );
        ///Si esta malo pues aja, mandamos error
        if (!response.ok) {
            Alerts.showToastCloseError("Error cargando conversion de unidades")
        }
        ///Retornamos la respuesta en formato json
        return response.json();
    } catch (error) {
        Alerts.showToastCloseError(`Error cargando conversion de unidades ${error}`)
        throw error;
    }
}
///Aca pues este es Muy Importante para el put, asi que si su CRUD no lo tiene, haganlo.
export async function getConversionUnitById(id) {
    ///Try para intentar
    try {
        ///Hacemos la peticion a la api
        const response = await fetch(`${API_URL}apiMeasure/getConversionUnitById/${id}`);
        ///Guardamos la respuesta en una variable, por que pues solo es uno va, u hace referencia usuario
        const u = await response.json();
        ///lo mismo de arriba
        if (!response.ok) {
            throw new Error(`Error cargando conversion de unidades: ${response.status}`);
        }
        return u;
    ///Ya lo saben
    } catch (error) {
        console.error("Error cargando conversion de unidades:", error);
        throw error;
    }
}

///Funcion para insertar usuarios, (Peticion)
export async function insertConversionUnit(payload) {
    ///Try
    try {
        ///Peticion para el insert y como lo queremos asi como su metodo
        const response = await fetch(`${API_URL}apiMeasure/insertConversionUnit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            ///Convertimos la respuesta a json
            body: JSON.stringify(payload)
        });
        ///Si esta bueno mandamos una alerta buena
        if (response.ok) {
            Alerts.showToastCloseSuccess("Conversion de unidades creada exitosamente")
        }
        ///Si no pues una mala
        else {
            Alerts.showToastCloseError(`Error creando conversion de unidades ${response.status}`)
        }
        ///Retornamos nuestra respuesta
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error creando conversion de unidad ${err}`)
    }
}

///Peticion para actualizar Recurso
///IMPORTANTE: QUE EN LA PETICION EL ID.VALUE 
export async function updateConversionUnit(payload, id) {
    ///Try
    try {
        ///Peticion para actualizar recurso
        const response = await fetch(`${API_URL}apiMeasure/updateConversionUnit/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            ///lo hacemos json
            body: JSON.stringify(payload)
        })
        ///Lo mismo que esta en insertResource, suban
        if (response.ok) {
            Alerts.showToastCloseSuccess("Conversion de unidad actualizada exitosamente")
        }
        else {
            Alerts.showToastCloseError(`Error actualizando conversion de unidad`)
        }
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error actualizando conversion de unidad ${err}`)
    }

}
///Aca esta el delete
export async function deleteConversionUnit(id) {
    ///Le pedimos una confirmacion al usuario 
    Swal.fire({
        title: "¿Estas seguro de que quieres eliminar a esta conversión?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: `Cancelar`
    }).then(async (result) => {
        ///Si el usuario acepta hacemos la peticion
        if (result.isConfirmed) {
            await fetch(`${API_URL}apiMeasure/deleteConversionUnit/${id}`, {
                method: 'DELETE'
            });
            Alerts.showToastCloseSuccess("Conversion eliminada exitosamente")
        } else if (result.isDenied) {
            Alerts.showToastCloseError("Proceso cancelado")
            return;
        }
    });
}