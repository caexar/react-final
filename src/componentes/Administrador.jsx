import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Administrador = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lista, setLista] = useState([]);
  const [nombre, setNombre] = useState("");
  const [capacidad, setCapacidad] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [disponibilidad, setDisponibilidad] = useState(false);
  const [ubicacion, setUbicacion] = useState("");
  const [modoedicion,setModoedicion]=useState(false)
  const [id,setId]=useState("")
  const [error,setError]=useState(null)

  useEffect(() => {
    if (auth.currentUser) {
      console.log("Existe un usuario logeado:", auth.currentUser);
      setUser(auth.currentUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection("Salas").get();
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(arrayData);
        setLista(arrayData);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, []);

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!nombre) return setError("ingrese el nombre");
    if (!capacidad) return setError("ingrese la capacidad");
    if (!descripcion) return setError("ingrese la descripcion");
    if (!ubicacion) return setError("ingrese la ubicacion");

    try {
      const nuevaSala = {
        capacidad,
        descripcion,
        disponibilidad,
        nombre,
        ubicacion
      };
      const dato = await db.collection("Salas").add(nuevaSala);
      setLista([
        ...lista,
        { id: dato.id, ...nuevaSala }
      ]);
      setNombre("");
      setCapacidad(0);
      setDescripcion("");
      setDisponibilidad(false);
      setUbicacion("");
      setError(null)
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarDato= async (id)=> {
    try {
      await db.collection("Salas").doc(id).delete()
      const listaFiltrada=lista.filter(elemento => elemento.id!==id)
      setLista(listaFiltrada)

    } catch (error) {
      console.log(error)
    }
  }

  const editar = (item)=>{
      setModoedicion(true)
      setNombre(item.nombre)
      setCapacidad(item.capacidad)
      setDescripcion(item.descripcion)
      setDisponibilidad(item.disponibilidad)
      setUbicacion(item.ubicacion)
      setId(item.id)

    }
    const editarDatos = async(e)=>{
      e.preventDefault();
      if (!nombre) return setError("ingrese el nombre");
      if (!capacidad) return setError("ingrese la capacidad");
      if (!descripcion) return setError("ingrese la descripcion");
      if (!ubicacion) return setError("ingrese la ubicacion");
      try {
        await db.collection("Salas").doc(id).update({ capacidad, descripcion, disponibilidad, nombre, ubicacion });
        const listaEditada = lista.map(elemento => elemento.id === id ? { id, capacidad, descripcion, disponibilidad, nombre, ubicacion } : elemento);
        setLista(listaEditada);
        setModoedicion(false);
        setNombre("");
        setCapacidad(0);
        setDescripcion("");
        setDisponibilidad(false);
        setUbicacion("");
        setError(null)
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <div className='container'>
      <h1>CRUD - SALAS</h1>
      <div className='row'>
        <div className='col-12'>
          <form onSubmit={modoedicion? editarDatos:guardarDatos}>
            {
              error? 
              (
                <div className='alert alert-danger' role='alert '> {error} </div>
              ):null
              
            }
            <input
              type="text"
              placeholder='ingrese el nombre'
              className='form-control mb-3'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="number"
              placeholder='ingrese la capacidad'
              className='form-control mb-3'
              value={capacidad}
              onChange={(e) => setCapacidad(parseInt(e.target.value, 10))}
            />
            <input
              type="text"
              placeholder='ingrese la descripcion'
              className='form-control mb-3'
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <select
              className='form-control mb-3'
              value={disponibilidad.toString()}
              onChange={(e) => setDisponibilidad(e.target.value === 'true')}
            >
              <option value="true">Disponible</option>
              <option value="false">No Disponible</option>
            </select>
            <input
              type="text"
              placeholder='ingrese la ubicacion'
              className='form-control mb-3'
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
            <div className='d-grid gap-2 mb-3'>
              {
                modoedicion?  <button className='btn btn-success' type='submit'>editar</button>:
                <button className='btn btn-primary' type='submit'>Registrar</button>
              }

            </div>
          </form>
        </div>
      </div>
      <div className='row mt-5'>
        <div className='col-12'>
          <h2>Listado de Salas</h2>
          <ul className='list-group'> 
            {lista.map(item => (
              <li key={item.id} className='list-group-item'>
               <p>Nombre: {item.nombre}</p>
               <p>Capacidad: {item.capacidad}</p>
               <p>Descripción: {item.descripcion}</p>
               <p>Ubicación: {item.ubicacion}</p>
               <p>Disponibilidad: {item.disponibilidad ? "Disponible" : "No Disponible"}</p>
                <button onClick={ ()=>eliminarDato(item.id)} className='btn btn-danger float-center mx-2'>eliminar</button>
                <button onClick={ ()=>editar(item)} className='btn btn-warning float-center mx-2'>editar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Administrador;
