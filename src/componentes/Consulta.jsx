
import React, { useState } from 'react';
import { db } from '../firebase';
const Consulta = () => {
    const [nombreSala, setNombreSala] = useState('');
    const [salasEncontradas, setSalasEncontradas] = useState([]);
  
    const buscarSalasPorNombre = async () => {
      try {
        const data = await db.collection("Salas").where("nombre", "==", nombreSala).get();
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSalasEncontradas(arrayData);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleChangeNombreSala = (event) => {
      setNombreSala(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      buscarSalasPorNombre();
    };
  
    return (
      <div>
        <h1 className='text-center text-color-success '>Busqueda de Salas</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la sala"
            value={nombreSala}
            onChange={handleChangeNombreSala}
            className='form-control'          
          />
          <div className='d-grid gap-2'>
          <button type="submit" className='btn btn-success'>Buscar</button>
          </div>
        </form>
        <ul>
        {salasEncontradas.map(sala => (
  <div key={sala.id} className="card mb-3 mt-3 mr-3" >
    <div className="card-body mr-3">
      <h5 className="card-title">{sala.nombre}</h5>
      <p className="card-text">Capacidad: {sala.capacidad}</p>
      <p className="card-text">Disponibilidad: {sala.disponibilidad ? "Disponible" : "No Disponible"}</p>
      <p className="card-text">Descripción: {sala.descripcion}</p>
      <p className="card-text">Ubicación: {sala.ubicacion}</p>
    </div>
  </div>
))}

        </ul>
      </div>
    );
  };
export default Consulta