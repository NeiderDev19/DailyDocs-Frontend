import api from "./api";

export const getDocumentos = async () => {
  try {
    const response = await api.get("/documentos");
    return response.data; // 👈 aquí ya tienes el JSON
  } catch (error) {
    console.error("Error obteniendo usuarios", error);
    throw error;
  }
};

export const getDocumentosById = async (id) => {
  try {
  const response = await api.get(`/documentos/usuario/${id}`);
  return response.data;
  } catch (error) {
    console.error("Error obtniendo documentos",error);
    throw error;
  }

}

export const deleteDocumento = async (id) => {
  try {
    const response = await api.delete(`/documentos/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el documento");
    throw error;
  }
}


export const subirDocumento = async (documento,idUser,file) => {
  const formData = new FormData();
  formData.append("doc",JSON.stringify(documento));
  formData.append("idUser",idUser);
  if(file){
    formData.append("file",file);
  }
  try{
    const response = await api.post(`/documentos/save`,formData,{
      headers : {
        "Content-Type" :"multipart/form-data",
      },
    });
    return response.data;
  }catch(err){
    console.error("Error al subir documento",err);
    throw err;
  }
}


export const updateDocumento = async (id,document,file)=> {
  const formData = new FormData();
  formData.append("doc",new Blob([JSON.stringify(document)],
{type:"application/json"}));
if(file) formData.append("file",file);

const res = await api.put(`/documentos?id=${id}` , formData , {
  headers : { "Content.Type" : "multipart/form-data"}
});
return res.data;
}


export const getComentariosDocumento = async (id) =>{
  try {
    const response = await api.get(`/comentarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const addComentarioDocumento = async (idDocumento,idUsuario,content) => {
  try{
    const response = await api.post(`/comentarios/document/${idDocumento}?idUsuario=${idUsuario}`,{content})
    return response.data;
  }catch(err){
    console.error(err);
    throw err;
  }
}

export const deleteComentario = async (idComentario) => {
  try {
    const response = await api.delete(`/comentarios/delete/${idComentario}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editComentarioDocumento = async (idComentario, texto) => {
  try {
    const formData = new FormData();
    formData.append("texto",texto);
    const response  = await api.put(`/comentarios/${idComentario}`,formData,{
      headers : {
        "Content-Type": "multipart/form-data"
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}