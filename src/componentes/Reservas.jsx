import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Reservas = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [salasDisponibles, setSalasDisponibles] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        if (auth.currentUser) {
          setUser(auth.currentUser);
          await obtenerSalasDisponibles();
          await obtenerReservas();
        } else {
          // Si no hay usuario logueado, redirigir a la página de login
          navigate("/reservas");
        }
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const obtenerSalasDisponibles = async () => {
    try {
      const data = await db.collection("Salas").where("disponibilidad", "==", true).get();
      const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSalasDisponibles(arrayData);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerReservas = async () => {
    try {
      const data = await db.collection("Usuarios").doc(auth.currentUser.uid).get();
      const reservasUsuario = data.data().salas || [];
      setReservas(reservasUsuario);
    } catch (error) {
      console.log(error);
    }
  };

  const reservarSala = async (sala) => {
    try {
      // Obtener el documento del usuario actual
      const usuarioRef = db.collection("Usuarios").doc(auth.currentUser.uid);
      const usuarioDoc = await usuarioRef.get();
  
      // Obtener el array de salas del usuario y agregar la nueva reserva
      let salasUsuario = usuarioDoc.data().salas || [];
      salasUsuario.push({
        salaId: sala.id,
        salaNombre: sala.nombre
      });
  
      // Actualizar el documento del usuario con el nuevo array de salas
      await usuarioRef.update({ salas: salasUsuario });
  
      // Marcar la sala como no disponible
      await db.collection("Salas").doc(sala.id).update({ disponibilidad: false });
  
      // Obtener las salas disponibles actualizadas
      await obtenerSalasDisponibles();
  
      // Obtener las reservas del usuario actualizadas
      await obtenerReservas();
  
      // Mostrar una alerta indicando que la sala se ha reservado con éxito
      alert(`Sala ${sala.nombre} reservada con éxito`);
  
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarReserva = async (reserva) => {
    try {
      // Obtener el documento del usuario actual
      const usuarioRef = db.collection("Usuarios").doc(auth.currentUser.uid);
      const usuarioDoc = await usuarioRef.get();

      // Obtener el array de salas del usuario y eliminar la reserva correspondiente
      let salasUsuario = usuarioDoc.data().salas || [];
      salasUsuario = salasUsuario.filter(sala => sala.salaId !== reserva.salaId);

      // Actualizar el documento del usuario con el array de salas actualizado
      await usuarioRef.update({ salas: salasUsuario });

      // Marcar la sala como disponible nuevamente
      await db.collection("Salas").doc(reserva.salaId).update({ disponibilidad: true });

      // Obtener las reservas del usuario actualizadas
      await obtenerReservas();

      // Obtener las salas disponibles actualizadas
      await obtenerSalasDisponibles();

      // Mostrar una alerta indicando que la reserva se ha eliminado con éxito
      alert(`Reserva de ${reserva.salaNombre} finalizada con éxito`);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <h1>Reservas de Salas</h1>
      <div className='row'>
        <div className='col-12'>
          <h2>Salas Disponibles</h2>
          <ul className='list-group'>
            {salasDisponibles.map(sala => (
              <li key={sala.id} className='list-group-item'>
                <p>Nombre: {sala.nombre}</p>
                <p>Capacidad: {sala.capacidad}</p>
                <p>Descripción: {sala.descripcion}</p>
                <p>Ubicación: {sala.ubicacion}</p>
                <button onClick={() => reservarSala(sala)} className='btn btn-success'>Reservar</button>
              </li>
            ))}
          </ul>
        </div>
        <div className='col-12 mt-5'>
          <h2>Mis Reservas</h2>
          <ul className='list-group'>
            {reservas.map(reserva => (
              <li key={reserva.salaId} className='list-group-item'>
                <p>Nombre de la Sala: {reserva.salaNombre}</p>
                <button onClick={() => eliminarReserva(reserva)} className='btn btn-danger'>Finalizar Reserva</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reservas;
