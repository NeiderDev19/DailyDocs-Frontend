import React, { useEffect, useState } from "react";
import { addComentarioDocumento, deleteComentario, editComentarioDocumento, getComentariosDocumento, getDocumentos } from "../../services/DocumentoService";
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import PDFViewer from "../Utils/PDFViewer";
import { useNavigate } from "react-router-dom";
import { InputTextarea } from 'primereact/inputtextarea';
import { toast } from "react-toastify";



const DocumentosList = () => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [comentario, setComentario] = useState("");
    const [edit, setEdit] = useState(false);
    const [editComentario, setEditComentario] = useState("");
    const navigate = useNavigate();



    const imagesCategoria = {
        springboot: "/img/descarga.png",
        javascript: "/img/descarga (1).png",
        bootstrap: "/img/bootstrap.png",
        react: "/img/react.png",
        tailwind: ""
    }

    /* const header = (
        <img alt="Card" src={imagesCategoria[categoria] || "https://primefaces.org/cdn/primereact/images/usercard.png"}/>
    ); */
    /* const footer = (
        <>
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
        </>
    ); */



    const handleSubmitComentario = async () => {
        if (!comentario.trim()) return;

        try {
            const idUsuario = localStorage.getItem("id");
            await addComentarioDocumento(selectedDoc.id, idUsuario, comentario);
            setComentario(""); //limpiar el text area
            //refrescar comentarios
            const data = await getComentariosDocumento(selectedDoc.id);
            setComentarios(data);
        } catch (error) {
            console.error(error);
        }
    }




    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const data = await getDocumentos();
                setDocumentos(data);
            } catch (err) {
                console.log(err);
                setError("No se pudieron cargar los documentos");
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentos();
    }, []);

    useEffect(() => {

        if (!selectedDoc) return;

        const fetchComentarios = async () => {
            try {
                const data = await getComentariosDocumento(selectedDoc.id);

                // 🔹 Ordenar los comentarios por fecha (de más antiguos a más nuevos)
                const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                setComentarios(sortedData)
            } catch (error) {
                console.error(error);
            }
        };
        fetchComentarios();
    }, [selectedDoc]);

    if (loading) return <p>Cargando documentos...</p>;
    if (error) return <p>{error}</p>;

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-3 ml-3"></img>;

    const InicialPerfil = localStorage.getItem("username")?.charAt(0).toUpperCase();
    const end = (
        <div className="flex align-items-center gap-2 mr-3">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Avatar shape="circle" label={InicialPerfil} style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
        </div>
    );

    //Eliminar comentario
    const handleComentarioDelete = async (idComentario, idDocumento) => {

        try {
            await deleteComentario(idComentario);
            const newData = await getComentariosDocumento(idDocumento);
            setComentarios(newData);
            toast.success("Comentario Eliminado")
        } catch (error) {
            console.error(error);
            toast.error(error);
        }

    }

    //Editar Comentario 
    const handleComentarioEdit = async (idComentario, texto) => {
        try {
            await editComentarioDocumento(idComentario, texto);
            // actualiza el estado local sin volver a pedir todo al backend
            const updatedData = await getComentariosDocumento(selectedDoc.id);
            setComentarios(updatedData);
            setEdit(false);
            toast.success("comentario editado");
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div className="publicaciones">
            {/* Menu arriba */}
            <div className="card mt-3">
                <Menubar className="flex-row justify-content-between" start={start} end={end} />
            </div>

            {/* Vista de listado */}
            {!selectedDoc && (
                <div className="documentos-grid-horizontal mt-4">
                    {documentos.map((doc) => (
                        <Card title={doc.titulo} header={
                            <img
                                alt="Card"
                                src={
                                    imagesCategoria[doc.categoria.toLowerCase()] ||
                                    "https://primefaces.org/cdn/primereact/images/usercard.png"
                                }
                            />
                        }
                            subTitle={`Por ${doc.usuario.nombres} ${doc.usuario.apellidos}`}
                            key={doc.id} className="documentos-card">
                            <small>{new Date(doc.fechaCreacion).toLocaleDateString()}</small>

                            <p className="mt-3">{doc.contenido}</p>

                            {/*  {doc.urlArchivo && doc.urlArchivo.endsWith(".pdf") && (
                        <embed src={doc.urlArchivo} type="application/pdf" width="100%" height="200px" />
                    )} */}
                            {doc.urlArchivo && doc.urlArchivo.match(/\.(jpg|jpeg|png|gif)$/) && (
                                <img src={doc.urlArchivo} alt={doc.titulo} />
                            )}
                            <p style={{ marginTop: "20px" }}>
                                <strong>Categoria:</strong> {doc.categoria}
                            </p>
                            <p>
                                <strong>Etiquetas:</strong> {doc.etiquetas.join(", ")}
                            </p>
                            {doc.urlArchivo && (
                                <a href={doc.urlArchivo} target="_blank" rel="noopener noreferrer">
                                    Descargar archivo
                                </a>
                            )}
                            <div className="buttons">
                                <Button label="Ver mas" className="p-1" icon="pi pi-eye"
                                    onClick={() => setSelectedDoc(doc)} />
                            </div>
                        </Card>
                    ))


                    }
                    {/* Vista de detalle */}
                    {console.log(selectedDoc)}

                </div>
            )}

            {selectedDoc && (
                <div className="card mt-4 p-3">
                    <Button label="volver"
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        onClick={() => setSelectedDoc(null)}
                        className="mb-3 p-1" />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <h2>{selectedDoc.titulo}</h2>
                            <p>
                                <strong>Por:</strong> {selectedDoc.usuario.nombres} {" "} {selectedDoc.usuario.apellidos}
                            </p>
                            <p>{selectedDoc.contenido}</p>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Button style={{ padding: '5px' }} label="Enviar Mensaje Autor" icon="pi pi-send"
                                onClick={() =>
                                    navigate("/app/mensajes", {
                                        state: {
                                            autorId: selectedDoc.usuario.id,
                                            username: selectedDoc.usuario.nombres + " " + selectedDoc.usuario.apellidos,
                                            mensajeInicial: "Hola, quería hablar sobre tu documento."
                                        }
                                    })
                                } />
                        </div>
                    </div>

                    {selectedDoc.urlArchivo &&
                        selectedDoc.urlArchivo.match(/\.(jpg|jpeg|png|gif)$/) && (
                            <img
                                src={selectedDoc.urlArchivo}
                                alt={selectedDoc.titulo}
                                style={{ maxWidth: "100%", marginTop: "1rem" }}
                            />
                        )}

                    {selectedDoc.urlArchivo &&
                        selectedDoc.urlArchivo.endsWith(".pdf") && (
                            <embed
                                src={selectedDoc.urlArchivo}
                                type="application/pdf"
                                width="100%"
                                height="500px"
                                style={{ marginTop: "1rem" }}
                            />
                        )}

                    {/*
                    <PDFViewer url={selectedDoc.urlArchivo} />
                    <embed
                                src={selectedDoc.urlArchivo}
                                type="application/pdf"
                                width="100%"
                                height="500px"
                                style={{ marginTop: "1rem" }}
                            /> */}

                    {/* Aquí podrías meter los comentarios */}
                    <div className="mt-4">
                        <h3 style={{ color: '#000000f8' }} className="font-semibold mb-3">Comentarios</h3>
                        {/* Aquí puedes mapear tus comentarios */}
                        {comentarios.length === 0 && (
                            <p>No hay comentarios</p>
                        )}

                        {comentarios.map((coment) => {

                            const isMine = coment.usuario.id === parseInt(localStorage.getItem("id"));

                            return (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                                    width: '100%',
                                }}>
                                    <Card style={{
                                        backgroundColor: isMine ? '#f5f9adff' : '#ffffff', width: '1050px',
                                        alignItems: 'center'
                                        , overflow: 'hidden',         // evita que el contenido se salga
                                        wordWrap: 'break-word',     // corta las palabras largas
                                        whiteSpace: 'normal'        // permite saltos de línea
                                    }} className="mt-2 mb-3 p-2">

                                        <div style={{ height: 'auto' }}>
                                            <div className="flex flex-row justify-content-between">
                                                <div>
                                                    <Avatar shape="circle" label={coment.usuario.nombres?.charAt(0).toUpperCase()} style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                                                    <span style={{ color: '#000' }} className="ml-2">{coment.usuario.nombres} {coment.usuario.apellidos}</span>
                                                </div>
                                                <div>
                                                    <p className="mt-1">{new Date(coment.timestamp).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{
                                                maxWidth: '1000px'
                                            }} className="mt-3">
                                                {coment.usuario.id == localStorage.getItem("id") && edit ? (
                                                    <InputTextarea style={{
                                                        marginTop: 3, marginBottom: 5, padding: '4px', width: '1000px',
                                                        height: 'auto'
                                                    }}
                                                        value={editComentario}
                                                        onChange={(e) => setEditComentario(e.target.value)}
                                                    ></InputTextarea>
                                                ) : (
                                                    <p>{coment.content}</p>
                                                )
                                                }

                                            </div>
                                        </div>
                                        {
                                            coment.usuario.id == localStorage.getItem("id") && (
                                                <div style={{
                                                    display: 'flex', flexDirection: 'row',
                                                    gap: '5px', justifyContent: 'flex-end', marginTop: '10px'
                                                }}>
                                                    {edit ? (
                                                        <Button onClick={() => handleComentarioEdit(coment.id, editComentario)} icon='pi pi-send' />
                                                    ) : (
                                                        <Button onClick={() => {
                                                            setEdit(true);
                                                            setEditComentario(coment.content);
                                                        }
                                                        } icon='pi pi-pencil' />
                                                    )
                                                    }
                                                    {!edit ? (
                                                        <Button onClick={
                                                            () => handleComentarioDelete(coment.id, coment.documento.id)
                                                        } icon="pi pi-trash" severity="danger"
                                                        />
                                                    ) : (
                                                        <Button onClick={() => setEdit(false)} severity="danger" icon='pi pi-arrow-left' />
                                                    )
                                                    }
                                                </div>
                                            )
                                        }

                                    </Card>
                                </div>
                            )
                        }
                        )
                        }




                        {/* Formulario para nuevo comentario */}
                        <InputTextarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            className="w-full p-2 border rounded mt-2"
                            placeholder="Escribe un comentario..."
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                label="Comentar"
                                onClick={handleSubmitComentario}
                                className="px-4 py-2 rounded"
                            />
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};


export default DocumentosList;
