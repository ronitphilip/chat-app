import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/slices/chatSlice";
import '../App.css';
import Update from '../components/Update';

const Contacts = ({ sideBar, userId }) => {
  const dispatch = useDispatch();

  const [searchUser, setSearchUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { allUsers } = useSelector((state) => state.chatReducer);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

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
    alert(`Chat with ${user.userName}`);
  };

  return (
    <div style={{ minHeight: "100vh", width: "30vw", backgroundColor: "#343434" }}>
      {sideBar ? (
        <>
          <div>
            <h2 className="text-light mt-2 ms-2 fw-bold">Chats</h2>

            <Form.Group className="mx-3 pt-2" controlId="formBasicEmail">
              {!searchUser && (
                <Form.Label className="search-box text-secondary">
                  <i className="fa-solid fa-magnifying-glass me-1"></i> Search
                </Form.Label>
              )}
              <Form.Control
                type="text"
                value={searchUser}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <div style={{ minHeight: "100%" }} className="mt-4 bg-dark">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} onClick={() => chatUser(user)} className="border-bottom p-2 d-flex flex-row align-items-center" >
                  <img height={"60px"} width={"60px"} className="rounded-circle" src={`http://localhost:8000/uploads/${user.profilePic}`} alt="profile" />
                  <h5 className="text-light ms-3">{user.userName}</h5>
                </div>
              ))
            ) : (
              <div className="text-light text-center pt-5">
                {searchUser ? "No users found" : "Start new conversation"}
              </div>
            )}
          </div>
        </>
      ) : (
        <Update sideBar={sideBar} userId={userId} />
      )}
    </div>
  );
};

export default Contacts;