import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import '../App.css';
import Update from '../components/Update';
import { baseURL } from "../redux/serverURL";

const Contacts = ({ sideBar, userId, setCurrentChat }) => {

  const [searchUser, setSearchUser] = useState("");  
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const { allUsers } = useSelector((state) => state.chatReducer);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchUser(value);

    if (value.trim()) {
      const filtered = allUsers.filter((user) =>
        user.userName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const chatUser = (user) => {
    setActiveUsers((prevActiveUsers) => {
      const isUserAlreadyActive = prevActiveUsers.some((activeUser) => activeUser.id === user.id);
  
      if (!isUserAlreadyActive) {
        return [...prevActiveUsers, user];
      }
  
      return prevActiveUsers;
    })
    setSearchUser("")
    setCurrentChat(user.id)
  };

  return (
    <div className="bg-dark" style={{ minHeight: "100vh", width: "30vw" }}>
      {sideBar ? (
        <>
          <div>
            <h2 className="text-light mt-2 ms-2 fw-bold">Chats</h2>
  
            {/* search bar */}
            <Form.Group className="mx-3 pt-2" controlId="formBasicEmail">
              {!searchUser && (
                <Form.Label className="search-box text-light">
                  <i className="fa-solid fa-magnifying-glass me-1"></i> Search
                </Form.Label>
              )}
              <Form.Control
                className="border-0 text-light userSearch"
                style={{ backgroundColor: '#464646' }}
                type="text"
                value={searchUser}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
  
          {searchUser != "" ? 
            (
              <div style={{ minHeight: "100%" }} className="mt-4 bg-dark">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} onClick={() => chatUser(user)} className="p-2 d-flex flex-row align-items-center userChatBox" >
                      <img height={"60px"} width={"60px"} className="rounded-circle" src={`${baseURL}/uploads/${user.profilePic}`} alt="profile" />
                      <h5 className="text-light ms-3">{user.userName}</h5>
                    </div>
                  ))
                ) : (
                  <div className="text-light text-center pt-5">
                    {searchUser ? "No users found!" : "Start new conversation"}
                  </div>
                )}
              </div>
            )
            : 
            activeUsers.length === 0 ? 
              (
                <div className="text-light text-center pt-5">Start new conversation</div>
              ) 
              : 
              (
                <div style={{ minHeight: "100%" }} className="mt-4 bg-dark">
                  {activeUsers.map((user) => (
                    <div key={user.id} onClick={() => chatUser(user)} className="p-2 border-bottom border-secondary d-flex flex-row align-items-center userChatBox" >
                      <img height={"60px"} width={"60px"} className="rounded-circle" src={`${baseURL}/uploads/${user.profilePic}`} alt="profile" />
                      <h5 className="text-light ms-3">{user.userName}</h5>
                    </div>
                  ))}
                </div>
              )
          }

        </>
      ) : (
        <Update sideBar={sideBar} userId={userId} />
      )}
    </div>
  );
  
}

export default Contacts;