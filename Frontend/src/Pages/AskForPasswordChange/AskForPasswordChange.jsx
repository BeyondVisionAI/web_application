import React from 'react'
import { useState } from 'react';
import Button from '../../GenericComponents/Button/Button';
import InputWithLabel from '../../GenericComponents/InputWithLabel/InputWithLabel';
import "./AskForPasswordChange.css"
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AskForPasswordChange = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'password'});
    const { tErr } = useTranslation('translation', {keyPrefix: "errMsgs.password"});
    const [email, setEmail] = useState(null)
    const history = useHistory()

    function askForChange() {
        if (!email ) {
            toast.error(tErr("usernameOrPwdNotFilled"));
        } else {
            axios({
                method: "POST",
                data: {
                  email: email,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/user/askForPasswordChange`,
                }).then((res) => {
                    toast.success(t('ifLinkPwdReset'));
                    history.push('/login')
                })
                .catch((err) => {
                    toast.success(t('ifLinkPwdReset'));
                    history.push('/login')
              })
        }
    }

    return (
        <div className="login-container">
            <div className="login-left-container">
                <div className="login-form">
                    <h1 className="login-form-title">Reset your password</h1>
                    <h2 className="login-form-under-title">Beyond Vision is a web platform designed to facilitate the creation of audio description for short films</h2>
                    <InputWithLabel placeholder="mail@website.com" type="text" label="Email of your account" onChange={setEmail}/>
                    <p className="login-no-account">Remember your password ? <b onClick={() => history.push("/login")}>Log In Now !</b></p>
                    <div style={{width: "50%", alignSelf: 'center'}}><Button onClick={askForChange} label="Reset your password"/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}

export default AskForPasswordChange;