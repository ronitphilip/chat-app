import React, { useEffect, useState } from 'react';
import '../App.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchUserData, addNewUser } from '../redux/slices/chatSlice';
import { socket } from '../socket/socket';

const Auth = ({ insideRegister = false }) => {
  const isRegister = insideRegister;
  const { allUsers } = useSelector((state) => state.chatReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
  });

  const [focusedField, setFocusedField] = useState({
    userName: false,
    email: false,
    password: false,
  });

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleFocus = (field) => {
    setFocusedField((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field, value) => {
    setFocusedField((prev) => ({ ...prev, [field]: value !== '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const existingUser = allUsers.find((item) => item.userName === formData.userName);
        const existingEmail = allUsers.find((item) => item.email === formData.email);

        if (existingUser) {
          toast.error('User Name already exists!');
          return;
        }

        if (existingEmail) {
          toast.error('Email address already in use!');
          return;
        }

        if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters long!');
          return;
        }

        const result = await dispatch(addNewUser(formData));
        if (addNewUser.fulfilled.match(result)) {
          toast.success('User created successfully!');
          dispatch(fetchUserData());
          navigate('/login');
        } else {
          toast.error('Failed to add user!');
        }
      } else {
        // Verify user credentials
        const existingUser = allUsers.find((item) => item.userName === formData.userName && item.password === formData.password);
        if (existingUser) {
          // Emit login event with user ID
          socket.emit('login', existingUser.id);
          sessionStorage.setItem('userId', existingUser.id);
          toast.success('Login Successful!');
          navigate('/chat');
        } else {
          toast.error('Invalid User Name or Password!');
        }
      }
    } catch (err) {
      console.error('Error during submission:', err);
      toast.error('Something went wrong! Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh' }} className="gradient-bg d-flex flex-column align-items-center justify-content-center">
      {isRegister ? (
        <Link className="register" to="/login">Already have an Account?</Link>
      ) : (
        <Link className="register" to="/register">Don't have an Account?</Link>
      )}
      <img src={logo} alt="logo" />
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="input-container">
            <label
              className={`input-label ${focusedField.email ? 'focused' : ''}`}
              htmlFor="email"
            >
              Email Address
            </label>
            <br />
            <input
              className="input-box"
              onFocus={() => handleFocus('email')}
              onBlur={(e) => handleBlur('email', e.target.value)}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="input-container">
          <label
            className={`input-label ${focusedField.userName ? 'focused' : ''}`}
            htmlFor="userName"
          >
            User Name
          </label>
          <br />
          <input
            className="input-box"
            onFocus={() => handleFocus('userName')}
            onBlur={(e) => handleBlur('userName', e.target.value)}
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label
            className={`input-label ${focusedField.password ? 'focused' : ''}`}
            htmlFor="password"
          >
            Password
          </label>
          <br />
          <input
            className="input-box"
            onFocus={() => handleFocus('password')}
            onBlur={(e) => handleBlur('password', e.target.value)}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="login-btn" type="submit">{isRegister ? 'Sign Up' : 'Log In'}</button>
        {!isRegister && (
          <div className="mt-2 d-flex justify-content-end">
            <Link to="/respas" className="btn btn-link forgot-pass">Forgot password?</Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default Auth;
