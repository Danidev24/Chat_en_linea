import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Welcome from './components/welcome/welcome.jsx'
import Register from './components/userRegister/register.jsx'
import Chat from './components/chat/chat.jsx'
import Login from './components/login/login.jsx'
import Profile from './components/profile/profiles.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Welcome/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/Profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
