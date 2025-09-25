import React, { useEffect, useState } from "react";
import { getDocumentos } from "../../services/DocumentoService";
import { Card } from "primereact/card";
import { Button } from 'primereact/button';

const DocumentosList = () => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <>
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
        </>
    );

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

    if (loading) return <p>Cargando documentos...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div className="documentos-grid-horizontal">
            {documentos.map((doc) => (
                <Card title={doc.titulo}
                 subTitle={`Por ${doc.usuario.nombres} ${doc.usuario.apellidos}`}
                 key={doc.id} className="documentos-card">
                    <p>{doc.contenido}</p>
                    <small>{new Date(doc.fechaCreacion).toLocaleDateString()}</small>
                    {doc.urlArchivo && doc.urlArchivo.endsWith(".pdf") && (
                        <embed src={doc.urlArchivo} type="application/pdf" width="100%" height="200px" />
                    )}
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
                        <Button label="Ver mas" icon="pi pi-check" />
                        <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{  maeginRight: '0.8rem', marginLeft: '0.8rem' , padding:"5px"}} />
                    </div>
                </Card>
            ))}
        </div>
    );

};


export default DocumentosList;
