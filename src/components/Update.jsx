import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserDetails } from "../redux/slices/chatSlice";
import '../App.css';
import cameraicon from '../assets/camera.png'
import check from '../assets/check.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../redux/serverURL";

const Update = ({ sideBar, userId }) => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.chatReducer);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const currentUser = allUsers?.find((item) => item.id == userId);

  const [preview, setPreview] = useState("");
  const [changeImage,setChangeImage] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState("")
  
  // State for form data
  const [formData, setFormData] = useState({
    userName: currentUser?.userName || "",
    email: currentUser?.email || "",
    password: currentUser?.password || "",
    profilePic: currentUser?.profilePic || "",
  });

  useEffect(() => {
    if (formData.profilePic && typeof formData.profilePic === 'string') {
      setPreview(`${baseURL}/uploads/${formData.profilePic}`);
    } else if (formData.profilePic instanceof File) {
      setPreview(URL.createObjectURL(formData.profilePic));
    }
  }, [formData.profilePic]);
  

  // Track which field is currently being edited
  const [editingField, setEditingField] = useState(null);

  const enableEdit = (field) => setEditingField(field);

  const saveEdit = () => {
    setEditingField(null);
    setChangeImage(false)

    const updatedDetails = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      profilePic: formData.profilePic,
    };
  
    dispatch(updateUserDetails({ id: userId, updatedDetails }));
  };  

  const updateUser = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setChangeImage(true)
    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
  
      try {
        const response = await axios.post(`${baseURL}/uploads`, uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Update state with the uploaded file's name and preview URL
        setFormData((prevData) => ({
          ...prevData,
          profilePic: response.data.fileName,
        }));
  
        setPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  

  const logout = () => {
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      {!sideBar && (
        <>
          <h2 className="text-light pt-2 ms-2 fw-bold">Profile</h2>
          <div style={{ minHeight: "92vh" }} className="d-flex flex-column align-items-center justify-content-evenly" >
            {/* profile image */}
            <img height={"200px"} width={"200px"} className="rounded-circle mx-auto" src={`${baseURL}/uploads/${formData.profilePic}`} alt="profile" />
            {
              changeImage ? (
                <button onClick={saveEdit} className="btn">
                  <img className="check" width={"90px"} src={check} alt="save" />
                </button>
              ) : (
                <label htmlFor="profilePic">
                  <img className="cameraicon" width={"50px"} src={cameraicon} alt="camera" />
                </label>
              )
            }

            <input
              onChange={e=>{handleFileChange(e)}}
              style={{ display: "none" }}
              type="file"
              id="profilePic"
              accept="image/*"
            />
            <div className="profileFields">
              {["userName", "email", "password"].map((field) => (
                <div key={field} className="d-flex flex-column input-container">
                  <label className="text-secondary" htmlFor={field}>
                    {field === "userName" ? "User Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {editingField === field ? (
                    <div className="d-flex flex-row">
                      <input
                        className="input-box"
                        onChange={updateUser}
                        type="text"
                        value={formData[field]}
                        name={field}
                        id={field}
                      />
                      <i onClick={saveEdit} className="fa-solid fa-check my-auto text-light"></i>
                    </div>
                  ) : (
                    <div className="d-flex flex-row">
                      <input
                        className="border-0 input-box"
                        type="text"
                        value={formData[field]}
                        name={field}
                        id={field}
                        disabled
                      />
                      <i onClick={() => enableEdit(field)} className="fa-solid fa-pen my-auto text-light"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={logout} className="btn text-danger">
              <i className="fa-solid fa-right-from-bracket me-3"></i>Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Update;
