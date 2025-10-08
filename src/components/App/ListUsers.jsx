import React, { useEffect, useState } from "react";
import { getUsuarios } from "../../services/userService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../../styles/ListaUsuarios.css"
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import AdminSend from "../Chat/AdminSend";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible,setVisible] = useState(false);
  const [toUserId,setToUserId] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const getBadge = (user) => {
  if (user.role === 'ADMINISTRADOR') return 'warning';
  else if (user.role === 'USER') return 'info';
  else return 'secondary'; // opcional, para otros casos
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="usuarios-container">
            <h2 className="usuarios-title mb-2">Lista de Usuarios</h2>
      <div className="usuarios-card">
        <DataTable
          value={usuarios}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          stripedRows
          responsiveLayout="scroll"
          className="usuarios-table"
        >
          <Column field="nombres" header="Nombres" style={{ width: "25%" }} />
          <Column field="apellidos" header="Apellidos" style={{ width: "25%" }} />
          <Column field="correo" header="Correo" style={{ width: "30%" }} />
          <Column field="role" header="Rol" style={{ width: "20%" }} body={(rowData) =>
            (
              <div>
                <Tag value={rowData.role} severity={getBadge(rowData)} 
                  style={{ padding: "6px 8px", fontSize: "10px", borderRadius: "6px" }}/>
              </div>
            )
          }/>
          <Column header="Acciones" style={{ width: "20%" }}
          body={(rowData) => (
            <div className="acciones">
                <Button 
                    icon="pi pi-send" 
                    className="p-button-rounded p-button-info p-mr-2" 
                    onClick={() => {
                      setVisible(true);
                      setToUserId(rowData.id);
                    }
                    } 
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger" 
                    onClick={() => console.log("Eliminar", rowData)} 
                />
            </div>
          )}/>

        </DataTable>
      </div>
       <Dialog header={<div><h4 style={{marginLeft:'14px'}}>Enviar mensaje</h4></div>} visible={visible} position="bottom-right" style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }} draggable={false} resizable={false}>
          <AdminSend toUserId={toUserId}/>
      </Dialog>
    </div>
  );
};

export default ListaUsuarios;
