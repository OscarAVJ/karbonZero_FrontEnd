import { APIURL } from "../../utils/api_url";

const IMAGE_API = "http://localhost:8080/api/image"; // Ajusta si tu backend está en otro puerto

// Subir imagen a la carpeta "Profiles"
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${IMAGE_API}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Error al subir la imagen");
  }

  return res.json(); // { message: "...", url: "https://..." }
}

export async function uploadImageToFolder(file, folder){
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const res = await fetch (`${IMAGE_API}/upload-to-folder`,{
        method: 'POST',
        body: formData,
        credentials: "include"
    });

    return res.json();
}