import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Inicio from './componentes/Inicio'
import Login from './componentes/Login'
import Administrador from './componentes/Administrador'
import Navbar from './componentes/Navbar'
import { auth,db } from './firebase'
import Reservas from './componentes/Reservas'

import Consulta from './componentes/Consulta'
function App() {
  const [count, setCount] = useState(0)
  const [firebaseUser,setFirebaseUser]=useState(false)
  useEffect(()=>{
    auth.onAuthStateChanged(user =>{
      if (user) {
        setFirebaseUser(user)
      }else{
        setFirebaseUser(null)
      }
    })
  },[])
  

  return  firebaseUser!==false ? (
    <Router>
      <Navbar firebaseUser={firebaseUser} />
      <Routes>
      <Route path='/inicio' element={<Inicio/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='/admin' element={<Administrador/>}/>
      <Route path='/consulta' element={<Consulta/>}/>
      <Route path='/reservas' element={<Reservas/>}/>
      </Routes>
    </Router>
  ):
  (<p>loading...</p>)
}

export default App
