import React from 'react'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [nombre, setNombre] = React.useState("")
    const [apellido, setApellido] = React.useState("")
    const [error, setError] = React.useState(null)
    const [modoRegistro, setModoRegistro] = React.useState(true)
    const navigate = useNavigate()

    const guardarDatos = (e) => {
        e.preventDefault();
        if (!email) return setError("Ingrese su email");
        if (!pass) return setError("Ingrese su contraseña");
        if (modoRegistro && !nombre) return setError("Ingrese su nombre");
        if (modoRegistro && !apellido) return setError("Ingrese su apellido");
        if (pass.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
        
        setError(null);
        
        if (modoRegistro) {
            registrar();
        } else {
            login();
        }
    }
    

    const login = React.useCallback(async () => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            console.log(res.user);
            setEmail("")
            setPass("")
            setError("")
            navigate('/inicio');

        } catch (error) {
            if (error.code === "auth/invalid-email") {
                setError("Email inválido")
            }
            if (error.code === "auth/user-not-found") {
                setError("Email no registrado")
            }
            if (error.code === "auth/wrong-password") {
                setError("Contraseña incorrecta")
            }
        }
    }, [email, pass, navigate])

    const registrar = React.useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass);
    
            // Agregar el nuevo usuario a Firestore con los campos adicionales
            await db.collection("Usuarios").doc(res.user.uid).set({
                nombre: nombre,
                apellido: apellido,
                email: res.user.email,
                salas: [] // Inicialmente, el array de salas está vacío
            });
    
            console.log("Usuario registrado con éxito:", res.user);
            setEmail("");
            setPass("");
            setError(null);
            navigate('/inicio'); // Redirige al usuario a la página de inicio después del registro
    
        } catch (error) {
            console.error("Error al registrar usuario:", error.code);
            if (error.code === "auth/email-already-in-use") {
                setError("Email ya registrado");
            } else if (error.code === "auth/invalid-email") {
                setError("Email inválido");
            } else {
                setError("Error al registrar usuario");
            }
        }
    }, [email, pass, nombre, apellido, navigate]);
    

    return (
        <div className='mt-5'>
            <h3 className='text-center'>
                {modoRegistro ? "Registro de usuarios" : "Login"}
            </h3>
            <div className='row justify-content-center'>
                <div>
                    <form onSubmit={guardarDatos}>
                        {error && <div className='alert alert-danger'>{error}</div>}
                        <input
                            type="email"
                            className='form-control mb-2'
                            placeholder='Ingrese su email'
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className='form-control mb-2'
                            placeholder='Ingrese su contraseña'
                            onChange={e => setPass(e.target.value)}
                        />
                        {modoRegistro && (
                            <>
                                <input
                                    type="text"
                                    className='form-control mb-2'
                                    placeholder='Ingrese su nombre'
                                    onChange={e => setNombre(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className='form-control mb-2'
                                    placeholder='Ingrese su apellido'
                                    onChange={e => setApellido(e.target.value)}
                                />
                            </>
                        )}
                        <div className='d-grid gap-2'>
                            <button className='btn btn-primary'>
                                {modoRegistro ? "Registrarse" : "Acceder"}
                            </button>
                            <button
                                className='btn btn-success'
                                onClick={() => setModoRegistro(!modoRegistro)}
                                type="button"
                            >
                                {modoRegistro ? "¿Ya estás registrado?" : "¿No tienes cuenta?"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
