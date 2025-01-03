import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { baseURL, serverURL } from '../redux/serverURL';
import defaultBackground from '../assets/background.jpg';
import SplashScreen from '../pages/SplashScreen'
import axios from 'axios';
import { updateUserDetails } from '../redux/slices/chatSlice';

const socket = io(baseURL);

const ChatSpace = ({userId, currentChat}) => {

  const [isOnline, setIsOnline] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [morebtnActive, setMorebtnActive] = useState(false);
  const [extraDisplay, setExtraDisplay] = useState('none');
  const [backgroundImage, setBackgroundImage] = useState(true)
  const [bgImagename, setBgImagename] = useState('')

  const { allUsers } = useSelector((state) => state.chatReducer);
  const currentUser = allUsers?.filter((user) => user.id == currentChat);
  const mainUser = allUsers?.find((user) => user.id == userId)

  useEffect(() => {
    if (mainUser && mainUser.chatWallpaper) {
      setBgImagename(mainUser.chatWallpaper);
    }
  }, [mainUser]);

  useEffect(() => {
      if (userId.trim()) {
          socket.emit('register', userId);
      }
      socket.on('user_status_change', ({ userId, status }) => {
        setIsOnline((prevStatuses) => ({
            ...prevStatuses,
            [userId]: status === 'online',
        }));
      });
      socket.on('private_message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      return () => {
        socket.off('user_status_change');
        socket.off('private_message');
      };
  }, [userId]);

  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        (msg.sender == userId && msg.receiver == currentChat) ||
        (msg.sender == currentChat && msg.receiver == userId)
    );
    setFilteredMessages(filtered);
  }, [messages, currentChat, userId]);

  const sendMessage = (e) => {
      e.preventDefault();
      if (message.trim() && userId.trim() && `${currentChat}`.trim()) {
          const messageData = {
              sender: userId,
              receiver: `${currentChat}`,
              messageBody: message,
          };
          socket.emit('private_message', messageData);
          setMessage(''); 
      }
  };

  const toggleMoreButton = (value) => {
    setMorebtnActive(value);
    setExtraDisplay(value ? '' : 'none');
    setBackgroundImage(value)
    if (mainUser && mainUser.chatWallpaper) {
      setBgImagename(mainUser.chatWallpaper);
    }
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
          <div key={user.id} className=" text-light h-100 d-flex flex-column justify-content-between">
            {/* Chat Header */}
            <div className="d-flex justify-content-between px-3" style={{ height: '70px', backgroundColor: '#464646', }} >
              {/* User Info */}
              <div className="d-flex">
                <img style={{ width: '55px', height : '55px' }} className="rounded-circle my-auto" src={`${baseURL}/uploads/${user.profilePic}`} alt="User" />
                <div className="my-auto ps-3">
                  <h5 className="mb-0 text-light">{user.userName}</h5>
                  <p className={`mb-0 ${isOnline[currentChat] ? 'text-success' : 'text-secondary'}`}>
                      {isOnline[currentChat] ? 'Online' : 'Offline'}
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
            <div className="chatbody px-5 d-flex flex-column">
              {filteredMessages.length == 0 ? (
                <p className="text-center fs-4">No messages yet!</p>
              ) : (
                filteredMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex align-items-center ${
                      msg.sender == userId ? "justify-content-end" : "justify-content-start"
                    }`}
                    style={{ margin: "5px 0" }}
                  >
                    {msg.sender != userId && (
                      <img
                        height="40px"
                        width="40px"
                        className="rounded-circle"
                        src={`${baseURL}/uploads/${user.profilePic}`}
                        alt="User"
                        style={{ marginRight: "10px" }}
                      />
                    )}
                    <div className={`chat-bubble ${msg.sender == userId ? "outgoing" : "incoming"}`}>
                      {msg.messageBody}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Footer */}
            <div className="d-flex justify-content-between px-3 py-3">
              <input
                style={{ backgroundColor: '#f1f1f1' }}
                className="w-100 mx-3 rounded-pill px-3 border-0 typingBox"
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                />
              <button
                style={{ height: '40px', width: '40px', backgroundColor: '#007bff' }}
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
