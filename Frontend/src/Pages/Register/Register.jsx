import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../GenericComponents/Auth/Auth';
import { Redirect, useHistory } from 'react-router-dom';
import "./Register.css"
import validator from 'validator';
import InputWithLabel from '../../GenericComponents/InputWithLabel/InputWithLabel';
import Button from '../../GenericComponents/Button/Button';

const Register = () => {
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const { currentUser } = useContext(AuthContext);
    const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    const nameRegex = "^[A-Za-zÀ-ÖØ-öø-ÿ0-9- ]{2,}$"
    const history = useHistory()

    function areFieldsValid() {
        const regexPassword = new RegExp(passRegex);
        const regexName = new RegExp(nameRegex);
        if (!validator.isEmail(email))
            return false
        if (!regexPassword.test(password))
            return false
        if (!regexName.test(firstName))
            return false
        if (!regexName.test(lastName))
            return false
        return true
    }

    async function register() {
        if (!firstName || !lastName || !password || !confirmPassword || !email) {
            toast.error("All the fields needs to be filled")
        } else if (password !== confirmPassword) {
            toast.error("Passwords are not matching")
        } else if(!areFieldsValid()) {
            toast.error("Invalid fields")
        } else {
            try {
                var res = await axios({
                    method: "POST",
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        password: password,
                        email: email,
                    },
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/user/register`,
                })
                if (res.status === 200) {
                    toast.success("Account created")
                    history.push('/login')
                }
            } catch (err) {
                if (err.response && (err.response.status === 409)) {
                    toast.error("Email already in use")
                } else {
                    toast.error("Error while contacting the server")
                }
            }
        }
    }

    if (currentUser) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="login-container">
            <div className="login-left-container">
                <div className="login-form">
                    <h1 className="login-form-title">Create an account</h1>
                    <h2 className="login-form-under-title">Beyond Vision is a web platform designed to facilitate the creation of audio description for short films</h2>
                    <InputWithLabel errorMessage="Invalid email address" verifyRegex={"email"} placeholder="mail@website.com" type="email" label="Email" onChange={setEmail} />
                    <InputWithLabel errorMessage="Name cannot contain special characters" verifyRegex={nameRegex} placeholder="John" type="text" label="First Name" onChange={setFirstName} />
                    <InputWithLabel errorMessage="Name cannot contain special characters" verifyRegex={nameRegex} placeholder="Doe" type="text" label="Last Name" onChange={setLastName} />
                    <InputWithLabel errorMessage="Min. 1 Uppercase, 1 number, 1 special character" verifyRegex={passRegex} placeholder="Min. 8 characters" type="password" label="Password" onChange={setPassword} />
                    <InputWithLabel errorMessage="Min. 1 Uppercase, 1 number, 1 special character" verifyRegex={passRegex} placeholder="Min. 8 characters" type="password" label="Verify Password" onChange={setConfirmPassword} />
                    <p className="login-no-account">Already have an account ? <b onClick={() => history.push("/login")}>Log In Now !</b></p>
                    <div style={{width: "50%", alignSelf: 'center', paddingBottom: '40px'}}><Button onClick={register} label="Create account"/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}

export default Register;