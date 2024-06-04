import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { auth, db } from '../firebase';

const Navbar = ({ firebaseUser }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); // Obtiene la función navigate del hook useNavigate

    useEffect(() => {
        const checkAdminRole = async () => {
            if (firebaseUser) {
                try {
                    const doc = await db.collection("Usuarios").doc(firebaseUser.uid).get();
                    
                    if (doc.exists) {
                        const userData = doc.data();
                        console.log(userData);
                        console.log("rol",userData.tipoUser);
                        if (userData.tipoUser === 1) {
                            setIsAdmin(true);
                            console.log("es admin");
                        } else {
                            setIsAdmin(false);
                            console.log("no es admin");
                        }
                    }       
                } catch (error) {
                    console.error('Error al obtener datos de usuario:', error);
                }
            }
        };

        checkAdminRole();
    }, [firebaseUser]);
    
    
    const cerrarSesion = () => {
        auth.signOut()
            .then(() => {
                navigate('/login'); // Utiliza navigate para redirigir al usuario a /login después de cerrar sesión
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    };

    return (
        <div className='navbar navbar-dark bg-dark'>
            <Link className='navbar-brand ml-2' to="/inicio">UnicostaDeportes</Link>
            <div>
                <div>
                    <Link className='btn btn-dark mr-2' to="/inicio">Inicio</Link>
                    {firebaseUser && !isAdmin && (
                        <React.Fragment>
                            <Link className='btn btn-dark mr-2' to="/reservas">Reservas</Link>
                            <Link className='btn btn-dark mr-2' to="/consulta">Consulta</Link>
                        </React.Fragment>
                    )}

                    {isAdmin && (
                        <React.Fragment>
                            <Link className='btn btn-dark mr-2' to="/admin">Admin</Link>
                            <Link className='btn btn-dark mr-2' to="/reservas">Reservas</Link>
                            <Link className='btn btn-dark mr-2' to="/consulta">Consulta</Link>
                        </React.Fragment>
                    )}

                    {firebaseUser ? (
                        <button className='btn btn-dark' onClick={cerrarSesion}>Cerrar sesión</button>
                    ) : (
                        <Link className='btn btn-dark mr-2' to="/login">Login/register</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
