import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Contacts from '../components/Contacts'
import ChatSpace from '../components/ChatSpace'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchUserData } from "../redux/slices/chatSlice";
import TestChat from './TestChat'

const ChatApp = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [sideBar, setSideBar] = useState(true)
  const [userId, setUserId] = useState('');
  const [currentChat, setCurrentChat] = useState('')

  useEffect(()=>{
    dispatch(fetchUserData());
    const storedUserId = sessionStorage.getItem('userId')
    if(storedUserId){
      setUserId(storedUserId)
    }else{
      navigate('/login')
    }
  },[dispatch])
  
  return (
    <>
      <div style={{overflow:'hidden'}} className="d-flex">
        <SideBar setSideBar={setSideBar}/>
        <Contacts sideBar={sideBar} userId={userId} setCurrentChat={setCurrentChat}/>
        <ChatSpace userId={userId} currentChat={currentChat}/>
      </div>
    </>
  )
}

export default ChatApp