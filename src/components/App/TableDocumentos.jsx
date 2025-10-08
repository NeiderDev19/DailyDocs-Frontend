import React, { useEffect, useRef, useState } from "react";
import { deleteDocumento, getDocumentosById, subirDocumento, updateDocumento } from "../../services/DocumentoService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext"; // <-- IMPORT IMPORTANTE
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { toast } from "react-toastify";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// Estilos base de primereact
import 'primereact/resources/themes/lara-light-blue/theme.css'; // 👈 puedes cambiar de tema
import 'primereact/resources/primereact.min.css';

// Estilos de íconos
import 'primeicons/primeicons.css';


const TableDocumentos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [globalFilter, setGlobalFilter] = useState("");
    const [visible, setVisible] = useState(false);
    const [nuevoDocumento, setNuevoDocumento] = useState({
        titulo: "",
        categoria: "",
        contenido: "",
        etiquetas:""
    });

    const [file,setFile] = useState(null);
    const idUser = localStorage.getItem("id");
    const [editingDoc,setEditingDoc] = useState(null);
    const fileInputRef = useRef(null);




    const confirmDelete = (id) => {
        confirmDialog({
            message: '¿Estas seguro que deseas eliminar este documento?',
            header: 'Confirmar Eliminacion',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger p-button-sm ml-2',
            rejectClassName: 'p-button-text p-button-secondary p-button-sm ml-2', // gris claro
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            className: 'custom-confirm',
            accept:()=>eliminarDocumento(id),
            reject:()=> toast.info("Operacion cancelada")
        });
      };
    
    


    useEffect(() => {
        const id = parseInt(localStorage.getItem("id"), 10); // 👈 importante
        fetchDocumentsId(id);
    }, []);

    const fetchDocumentsId = async (id) => {
            try {
                const data = await getDocumentosById(id);
                console.log("Respuesta del backend:", data);
                setDocumentos(data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los documentos");
            } finally {
                setLoading(false);
            }
        };

    //abrir el modal en modo nuevo
    const openNew = () => {
        setEditingDoc(null);
        setNuevoDocumento({
            titulo:"",
            categoria:"",
            contenido:"",
            etiquetas:[]
        });
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        setVisible(true);
    }

    //abrir en modo editar
    const openEdit = (rowData) => {
        setEditingDoc(rowData);
        setNuevoDocumento({
            titulo: rowData.titulo || "",
            categoria : rowData.categoria || "",
            contenido : rowData.contenido || "",
            etiquetas: rowData.etiquetas || []
        });
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        setVisible(true);
    }


     const handleSubmit = async() => {
        try {
            if(editingDoc){
                //EDITAR
                await updateDocumento(editingDoc.id, nuevoDocumento,file);
                toast.success("Documento actualizado");
            }else{
            //CREAR
            await subirDocumento(nuevoDocumento,idUser,file);
            toast.success("Documento creado");
            }
            const id = parseInt(localStorage.getItem("id"), 10); // 👈 importante
            fetchDocumentsId(id);

            //limpiar y cerrar el modal
            setVisible(false);
            setEditingDoc(null);
            setNuevoDocumento({
                titulo:"",
                categoria:"",
                contenido:"",
                etiquetas:[]
            });
            setFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            
        } catch (error) {
            console.error("Error al subir el documento", error);
            toast.error("Error al guardar el documento")
        }
    }

    const eliminarDocumento = async (id) => {
        try {
            await deleteDocumento(id);
            const idUser = parseInt(localStorage.getItem("id"), 10); // 👈 importante
            fetchDocumentsId(idUser);
            toast.success("Documento eliminado");
        } catch (error) {
            console.error("Error",error);
            throw error;
        }
    }

    if (loading) return <p>Cargando Documentos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="table-documentos">
            <h2 className="usuarios-title">Mis Documentos</h2>
            <ConfirmDialog />
            <div className="documentos-card">
                <DataTable value={documentos}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    stripedRows
                    responsiveLayout="scroll"
                    className="usuarios-table"
                    globalFilter={globalFilter}
                    header={
                        <div className="flex justify-content-between align-items-center p-3 border-round shadow-2 bg-gray-50">
                            <div className="agregar">
                                <Button icon="pi pi-file-plus"
                                    className="p-button-rounded p-button-success p-mr-2"
                                    onClick={openNew}></Button>
                            </div>
                            <div className="flex flex-row">
                                <InputText
                                    type="search"
                                    onInput={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Buscar en todo..."
                                    className="w-20rem border-round"
                                />
                                <i className="pi pi-search" />
                            </div>
                        </div>
                    }
                    tableStyle={{ gap: '50px' }}>
                    <Column field="titulo" header="Titulo" ></Column>
                    <Column field="contenido"
                        header="Contenido">
                    </Column>
                    <Column field="fechaCreacion" header="Fecha"></Column>
                    <Column field="categoria" header="Categoria"></Column>
                    <Column field="etiquetas" header="Etiquetas"></Column>
                    <Column header="Archivo" body={(rowData) =>
                    (
                        <a href={rowData.urlArchivo}
                            target="_blank"
                            rel="noopener noreferrrer"
                        >
                            <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </a>
                    )
                    }></Column>
                    <Column header="Acciones" style={{ width: "20%" }}
                        body={(rowData) => (
                            <div className="acciones">
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-info p-mr-2"
                                    onClick={() => openEdit(rowData)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger"
                                    onClick={() => 
                                        confirmDelete(rowData.id)}
                                />
                            </div>
                        )} />
                </DataTable>

            </div>

            <Dialog
                header={editingDoc ? "Editar Documento" : "Agregar Documento"}
                visible={visible}
                className="dialog"
                style={{
                    width: "35vw"
                }}
                modal
                onHide={() => setVisible(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="titulo">Titulo</label>
                        <InputText
                            id="titulo"
                            value={nuevoDocumento.titulo}
                            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, titulo: e.target.value })}>
                        </InputText>
                    </div>
                    <div className="field">
                        <label htmlFor="contenido">Contenido</label>
                        <InputTextarea
                            id="contenido"
                            value={nuevoDocumento.contenido}
                            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, contenido: e.target.value })}>
                        </InputTextarea>
                    </div>
                    <div className="field">
                        <label htmlFor="categoria">Categoria</label>
                        <InputText
                            id="categoria"
                            value={nuevoDocumento.categoria}
                            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, categoria: e.target.value })}>
                        </InputText>
                    </div>
                    <div className="field">
                        <div className="card">
                        <label htmlFor="etiquetas">Etiquetas</label>
                        <Chips style={{height:"40px",
                        marginTop:"6px"
                        }}
                            id="etiquetas"
                            value={nuevoDocumento.etiquetas || []}
                            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, etiquetas: e.value })}
                            placeholder="Ingrese las etiquetas"
                        />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="archivo">
                            <i className="pi pi-file-pdf" style={{
                                fontSize: '1.5rem', color: 'red',
                                margin: '10px'
                            }}></i>
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    <div className="actions flex justify-content-end gap-3 mt-3">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setVisible(false)}
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={() => {
                                handleSubmit();
                                setVisible(false);
                            }}
                        />
                    </div>
                </div>
            </Dialog>

        </div>
    )
}


export default TableDocumentos;