import React from 'react'
import "./ResetPassword.css"
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputWithLabel from './../../GenericComponents/InputWithLabel/InputWithLabel';
import Button from './../../GenericComponents/Button/Button';
import axios from 'axios';

const ResetPassword = () => {
    let location = useLocation()
    const [uid, setUID] = useState()
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const history = useHistory()
    const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"

    useEffect(() => {
        setUID(new URLSearchParams(location.search).get("verifUID"))
    }, [location]);

    
    async function makeChange() {
        const regexPassword = new RegExp(passRegex);
        if (password !== confirmPassword) {
            toast.error("Passwords are not matching")
            return
        }
        if (!regexPassword.test(password)) {
            toast.error("Passwords are not matching")
            return
        }
        try {
            var res = await axios({
                method: "POST",
                data: {
                    password: password,
                    verifId: uid,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/user/changePassword`,
            })
            if (res.status === 200) {
                toast.success("Password successfully changed")
                history.push('/login')
            }
        } catch (err) {
            toast.error("Could not modify password. Try again later")
            history.push('/login')
        }
    }

    return (
        <div className="login-container">
            <div className="login-left-container">
                <div className="login-form">
                    <h1 className="login-form-title">Reset your password</h1>
                    <h2 className="login-form-under-title">Beyond Vision is a web platform designed to facilitate the creation of audio description for short films</h2>
                    <InputWithLabel errorMessage="Min. 1 Uppercase, 1 number, 1 special character" verifyRegex={passRegex} placeholder="Min. 8 characters" type="password" label="Password" onChange={setPassword} />
                    <InputWithLabel errorMessage="Min. 1 Uppercase, 1 number, 1 special character" verifyRegex={passRegex} placeholder="Min. 8 characters" type="password" label="Verify Password" onChange={setConfirmPassword} />
                    <p className="login-no-account">Remember your password ? <b onClick={() => history.push("/login")}>Log In Now !</b></p>
                    <div style={{width: "50%", alignSelf: 'center'}}><Button onClick={makeChange} label="Reset your password"/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}
 
export default ResetPassword;