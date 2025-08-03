import { APIURL as API_URL} from "../../utils/api_url";

///Exporamos la funcion para poder importarla en nuestro controlador
export async function getUsers() {
    try{
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        const response = await fetch(`${API_URL}apiUser/getAllUsers`);
        if(!response.ok){
            throw new Error(`Error fetching users: ${response.status}`);
        }
        return response.json();
    }catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }    
}

export async function insertUser(payload) {
    const response = await fetch(`${API_URL}apiUser/insertUser`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(!response.ok) throw new Error('Error creando usuario');
    return response.json();

}

export async function updateUser(payload) {
    const response = await fetch(`${API_URL}apiUser/updateUser`,{
        method: 'PUT',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(!response.ok) throw new Error('Error creando usuario');
    return response.json();
}
export async function deleteUser(id) {
    Swal.fire({
        title: "Estas seguro de que quieres eliminar a este usuario?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: `Cancelar`
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${API_URL}apiUser/deleteUser/${id}`, {
                method: 'DELETE'
            });
        } else if (result.isDenied) {
            return;
        }
    });
}