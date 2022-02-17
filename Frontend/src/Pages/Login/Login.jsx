import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from './../../GenericComponents/Auth/Auth';
import { Redirect, useHistory } from 'react-router-dom';
import "./Login.css"
import InputWithLabel from '../../GenericComponents/InputWithLabel/InputWithLabel';
import Button from './../../GenericComponents/Button/Button';

const Login = () => {
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)
    const { currentUser } = useContext(AuthContext);
    const history = useHistory()
    
    console.log("Hello");
    function authenticate() {
        if (!email || !password) {
            toast.error("Username or password not filled")
        } else {
            axios({
                method: "POST",
                data: {
                  email: email,
                  password: password,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/user/login`,
              }).then((res) => {
                  if (res.status === 200) {
                    window.location.reload()
                }
              })
              .catch((err) => {
                if ((err.response.status === 404)) {
                    toast.error("Invalid email or password")
                } else if (err.response.status === 401 && err.response.data == "EMAIL_NOT_VERIFIED") {
                    toast.error("Email not verified")
                } else if (err.response.status === 401 && err.response.data == "INVALID_PASSWORD") {
                    toast.error("Invalid email or password")
                } else {
                    toast.error("Error while contacting the server")
                }
              })
        }
    }

    if (currentUser) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="login-container">
            <div className="login-left-container">
                <div className="login-form">
                    <p onClick={() => history.push('')} style={{cursor: 'pointer'}}>← Go back to Home Page</p>
                    <h1 className="login-form-title">Log In</h1>
                    <h2 className="login-form-under-title">Beyond Vision is a web platform designed to facilitate the creation of audio description for short films</h2>
                    <InputWithLabel placeholder="mail@website.com" type="text" label="Email" onChange={setEmail}/>
                    <InputWithLabel placeholder="Min. 8 characters" type="password" label="Password" onChange={setPassword}/>
                    <p className="login-no-account">No account ? <b onClick={() => history.push('/register')}>Create one now !</b></p>
                    <p className="login-no-account">Forgot your password ? <b onClick={() => history.push('/askForPasswordChange')}>Reset it now !</b></p>
                    <div style={{width: "50%", alignSelf: 'center'}}><Button onClick={authenticate} label="Login"/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}

export default Login;