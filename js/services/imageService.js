import { APIURL } from "../../utils/api_url";


// Subir imagen a la carpeta "Profiles"
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${APIURL}api/image/upload`, {
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

    const res = await fetch (`${APIURL}api/image/upload-to-folder`,{
        method: 'POST',
        body: formData,
        credentials: "include"
    });

    return res.json();
}