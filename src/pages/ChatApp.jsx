import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Contacts from '../components/Contacts'
import ChatSpace from '../components/ChatSpace'
import { useNavigate } from 'react-router-dom'

const ChatApp = () => {

  const navigate = useNavigate();
  const [sideBar, setSideBar] = useState(true)
  const [userId, setUserId] = useState('');

  useEffect(()=>{
    const storedUserId = sessionStorage.getItem('userId')
    if(storedUserId){
      setUserId(storedUserId)
    }else{
      navigate('/login')
    }
  },[])
  
  return (
    <>
      <div style={{overflow:'hidden'}} className="d-flex">
        <SideBar setSideBar={setSideBar}/>
        <Contacts sideBar={sideBar} userId={userId}/>
        <ChatSpace/>
      </div>
    </>
  )
}

export default ChatApp