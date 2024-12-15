import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import defaultBackground from '../assets/background.jpg';
import { baseURL, serverURL } from '../redux/serverURL';
import '../App.css';
import SplashScreen from '../pages/SplashScreen'
import { updateUserDetails } from '../redux/slices/chatSlice';
import axios from 'axios';

const ChatSpace = ({ userId, currentChat }) => {

  const dispatch = useDispatch()
  const [isOnline, setIsOnline] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [morebtnActive, setMorebtnActive] = useState(false);
  const [extraDisplay, setExtraDisplay] = useState('none');
  const [backgroundImage, setBackgroundImage] = useState(true)
  const [bgImagename, setBgImagename] = useState('')
  const [messages, setMessages] = useState([]);
  console.log(messages);
  
  const { allUsers } = useSelector((state) => state.chatReducer);
  const currentUser = allUsers?.filter((user) => user.id == currentChat);
  const mainUser = allUsers?.find((user) => user.id == userId)
  const socket = io(baseURL);

  useEffect(() => {
    if (mainUser && mainUser.chatWallpaper) {
      setBgImagename(mainUser.chatWallpaper);
    }
  }, [mainUser]);  

  useEffect(() => {
    // Join user's room
    socket.emit('login', userId);
    console.log(`User ${userId} logged in and joined room`);
  
    // Listen for incoming messages
    socket.on('receiveMessage', ({ fromUserId, message }) => {
      console.log(`Received message from ${fromUserId}: ${message}`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: fromUserId, text: message, type: 'incoming' },
      ]);
    });
  
    // Check if user is connected
    socket.on('connect', () => {
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });
  
    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, [socket, userId]);

  
  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = { senderId: userId, text: messageInput, type: 'outgoing' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit the message to the server
      socket.emit('sendMessage', { toUserId: currentChat, message: messageInput });

      setMessageInput(''); // Clear the input field
    }
  };

  const toggleMoreButton = (value) => {
    setMorebtnActive(value);
    setExtraDisplay(value ? '' : 'none');
    setBackgroundImage(value)
  };

  const handleUploadBG = async (e) => {
    const file = e.target.files[0];
    setBackgroundImage(false);
  
    if (file) {
      const uploadBackground = new FormData();
      uploadBackground.append('file', file);
  
      try {
        const response = await axios.post(`${baseURL}/uploads`, uploadBackground, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBgImagename(response.data.fileName);
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };
  
  const saveWallpaper = async () => {
    try {
      const userDetails = {
        ...currentUser[0],
        chatWallpaper: bgImagename,
      };
  
      await axios.put(`${serverURL}/userDetails/${userId}`, userDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      dispatch(updateUserDetails({ id: userId, userDetails }));
      toggleMoreButton(false);
    } catch (err) {
      console.error('Error updating user details:', err);
    }
  };
  
  return (
    <div
      style={{
        height: '100vh',
        width: '66vw',
        backgroundImage: mainUser?.chatWallpaper ? `url(${baseURL}/uploads/${bgImagename})` : `url(${defaultBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        flex: 1,
      }}
    >
      {currentUser.length > 0 ? (
        currentUser.map((user) => (
          <div key={user.id} className="h-100 d-flex flex-column justify-content-between">
            {/* Chat Header */}
            <div className="d-flex justify-content-between px-3" style={{ height: '70px', backgroundColor: '#464646', }} >
              {/* User Info */}
              <div className="d-flex">
                <img style={{ width: '55px', height : '55px' }} className="rounded-circle my-auto" src={`${baseURL}/uploads/${user.profilePic}`} alt="User" />
                <div className="my-auto ps-3">
                  <h5 className="mb-0 text-light">{user.userName}</h5>
                  <p className={`mb-0 ${isOnline ? 'text-success' : 'text-secondary'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
  
              {/* More Button */}
              <div className="d-flex">
                <button onClick={() => toggleMoreButton(!morebtnActive)} className="btn morebtn" >
                  <i className={`fa-solid ${morebtnActive ? 'fa-xmark' : 'fa-bars'} my-auto fs-5 text-secondary`}></i>
                </button>
                <div className="rounded bg-dark text-light " style={{display: extraDisplay, padding: '10px 15px', position: 'absolute', right: '30px', top: '50px', }}>
                  <div className='text-center my-2'>Chat Background</div>
                  <div className='border rounded p-5'>
                    { backgroundImage ? (
                      <label htmlFor="bgImage">
                      <div className='d-flex flex-column align-items-center'>
                        <i className='fa-solid fa-upload border p-2 rounded-circle'></i> <br />
                        <span style={{textDecoration:'underline'}}>Upload image</span>
                      </div>
                    </label>
                      )
                      :
                      (
                      <div className='d-flex flex-column align-items-center'>
                        <button className='btn' onClick={saveWallpaper}>
                          <i className='fa-solid fa-check border p-2 rounded-circle text-light'></i>
                        </button> <br />
                        <span style={{textDecoration:'underline'}}>{bgImagename}</span>
                      </div>
                      )
                    }
                    <input 
                      onChange={handleUploadBG}
                      type="file" 
                      id='bgImage'
                      name='bgImage'
                      accept="image/*"
                      style={{display:'none'}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'outgoing' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '60%',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: msg.type === 'outgoing' ? '#4caf50' : '#f1f1f1',
                      color: msg.type === 'outgoing' ? 'white' : 'black',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Footer */}
            <div className="d-flex justify-content-between px-3 py-3" style={{ height: '70px' }}>
              <input
                style={{ backgroundColor: '#f1f1f1' }}
                className="w-100 mx-3 rounded-pill px-3 border-0 typingBox"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
              />
              <button
                style={{ height: '40px', width: '40px', backgroundColor: '#464646' }}
                className="rounded-circle border-0"
                onClick={sendMessage}
              >
                <i className="fa-regular fa-paper-plane text-light"></i>
              </button>
            </div>

          </div>
        ))
      ) : (
        <div>
          <SplashScreen/>
        </div>
      )}
      
    </div>
  );
};

export default ChatSpace;