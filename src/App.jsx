import Login from './components/Login.jsx';
import { Routes, Route } from "react-router-dom";
import './App.css'
import Register from './components/Register.jsx';

function App() {


  return (
   <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
   </Routes>
  )
}

export default App
