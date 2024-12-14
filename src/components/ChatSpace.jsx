import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import background from '../assets/background.jpg';
import { baseURL, serverURL } from '../redux/serverURL';
import '../App.css';
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
  
  const { allUsers } = useSelector((state) => state.chatReducer);
  const currentUser = allUsers.filter((user) => user.id === currentChat);
  const mainUser = allUsers.find((user) => user.id == userId)

  useEffect(() => {
    if (mainUser) {
      setBgImagename(mainUser.chatWallpaper || '');
    }
  }, [mainUser]);
console.log(bgImagename);

  const toggleMoreButton = (value) => {
    setMorebtnActive(value);
    setExtraDisplay(value ? '' : 'none');
    setBackgroundImage(value)
  };

  const handleUploadBG = async (e) => {
    const file = e.target.files[0];
    setBgImagename(file.name);
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
        backgroundImage: `url(${baseURL}/uploads/${bgImagename})`,
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
                      style={{display:'none'}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Body */}
              <div>
              </div>

            {/* Chat Footer */}
            <div className="d-flex justify-content-between px-3 py-3" style={{ height: '70px' }} >
              <button style={{height: '40px', width: '40px', backgroundColor: '#464646', }} className="rounded-circle border-0" >
                <i className="fa-solid fa-plus text-light"></i>
              </button>
              <input
                style={{ backgroundColor: '#f1f1f1' }}
                className="w-100 mx-3 rounded-pill px-3 border-0 typingBox"
                type="text"
                placeholder={messageInput ? '' : 'Type a message'}
              />
              <button style={{height: '40px', width: '40px', backgroundColor: '#464646', }} className="rounded-circle border-0" >
                <i className="fa-regular fa-paper-plane text-light"></i>
              </button>
            </div>

          </div>
        ))
      ) : (
        <div>New Chat</div>
      )}
      
    </div>
  );
};

export default ChatSpace;
