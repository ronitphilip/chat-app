import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, resPass } from "../redux/slices/chatSlice";
import '../App.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResPas = () => {
    const dispatch = useDispatch();
    const { allUsers } = useSelector((state) => state.chatReducer);
    const navigate = useNavigate();

    const [focusedField, setFocusedField] = useState({
        userName: false,
        email: false,
        password: false,
    });

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [step, setStep] = useState(1);

    // update if the user details is empty
    useEffect(() => {
        if (allUsers.length === 0) {
            dispatch(fetchUserData());
        }
    }, [dispatch, allUsers]);

    const handleFocus = (field) => {
        setFocusedField((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field, value) => {
        setFocusedField((prev) => ({ ...prev, [field]: value !== "" }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (step === 1) {
            // to check if the username is valid
            const existingUser = allUsers.find((item) => item.userName === formData.userName);
            existingUser ? setStep(2) : toast.error('Invalid Username!');
        } else if (step === 2) {
            // to check if the given email matches the user's email
            const existingUser = allUsers.find((item) => item.userName === formData.userName);
            if (existingUser) {
                existingUser.email === formData.email ? setStep(3) : toast.error('Email does not match! Please enter a different email.');
            } else {
                toast.error('Invalid Username!');
            }
        } else if (step === 3) {
            // to change the password
            if (formData.newPassword.length >= 8 && formData.confirmPassword.length >= 8) {
                const existingUser = allUsers.find((item) => item.userName === formData.userName);
                if (formData.newPassword === formData.confirmPassword) {
                    dispatch(resPass({ id: existingUser.id, updatedPassword: formData.newPassword }))
                    .then(() => {
                        toast.success("Password updated successfully!")
                        navigate('/login')
                    })
                    .catch(() => toast.error("Failed to update password!"))
                } else {
                    toast.error('Passwords do not match!');
                }
            } else {
                toast.error('Password must be at least 8 characters long!');
            }
        }
    };
    

    return (
        <div
            style={{ minHeight: "100vh" }}
            className="gradient-bg d-flex flex-column align-items-center justify-content-center"
        >
            <form onSubmit={handleSubmit}>
                {step >= 1 && (
                    <div className="input-container">
                        <label
                            className={`input-label ${focusedField.userName ? "focused" : ""}`}
                            htmlFor="userName"
                        >
                            User Name
                        </label>
                        <br />
                        <input
                            className="input-box"
                            onFocus={() => handleFocus("userName")}
                            onBlur={(e) => handleBlur("userName", e.target.value)}
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {step >= 2 && (
                    <div className="input-container">
                        <label
                            className={`input-label ${focusedField.email ? "focused" : ""}`}
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <br />
                        <input
                            className="input-box"
                            onFocus={() => handleFocus("email")}
                            onBlur={(e) => handleBlur("email", e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {step >= 3 && (
                    <>
                        <div className="input-container">
                            <label
                                className={`input-label ${focusedField.newPassword ? "focused" : ""
                                    }`}
                                htmlFor="newPassword"
                            >
                                New Password
                            </label>
                            <br />
                            <input
                                className="input-box"
                                onFocus={() => handleFocus("newPassword")}
                                onBlur={(e) => handleBlur("newPassword", e.target.value)}
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label
                                className={`input-label ${focusedField.confirmPassword ? "focused" : ""
                                    }`}
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                            </label>
                            <br />
                            <input
                                className="input-box"
                                onFocus={() => handleFocus("confirmPassword")}
                                onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="login-btn">
                    {step === 3 ? "Reset Password" : "Next"}
                </button>
            </form>
        </div>
    );
};

export default ResPas;
