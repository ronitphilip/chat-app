import './App.css'
import { Routes, Route } from 'react-router-dom'
import ChatApp from './pages/ChatApp'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { Toaster } from 'react-hot-toast'
import ResPas from './pages/ResPas'
import TestChat from './pages/TestChat'

function App() {

  return (
    <>
      <Toaster/>
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth insideRegister={true}/>} />
      <Route path='/respas' element={<ResPas/>} />
      <Route path="/chat" element={<ChatApp />} />
      <Route path="/testchat" element={<TestChat />} />
      </Routes>
    </>
  )
}

export default App
