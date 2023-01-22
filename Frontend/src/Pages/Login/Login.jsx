import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from './../../GenericComponents/Auth/Auth';
import { Redirect, useHistory } from 'react-router-dom';
import "./Login.css"
import InputWithLabel from '../../GenericComponents/InputWithLabel/InputWithLabel';
import Button from './../../GenericComponents/Button/Button';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'authentication'});
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'authentication.errorMessages'});
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)
    const { currentUser } = useContext(AuthContext);
    const history = useHistory()

    function authenticate() {
        if (!email || !password) {
            toast.error(tErr('usernameOrPasswordNotFilled'))
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
                    toast.error(tErr('invalidEmailOrPassword'))
                } else if (err.response.status === 401 && err.response.data === "EMAIL_NOT_VERIFIED") {
                    toast.error(tErr('unverifiedEmail'))
                } else if (err.response.status === 401 && err.response.data === "INVALID_PASSWORD") {
                    toast.error(tErr('invalidEmailOrPassword'))
                } else {
                    toast.error(tErr('serverError'))
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
                    <p onClick={() => history.push('')} style={{cursor: 'pointer'}}>{t('goBackHome')}</p>
                    <h1 className="login-form-title">{t('logInForm.title')}</h1>
                    <h2 className="login-form-under-title">{t('logInForm.underTitle')}</h2>
                    <InputWithLabel placeholder={t('logInForm.email.placeholder')} type="text" label={t('logInForm.email.label')} onChange={setEmail}/>
                    <InputWithLabel placeholder={t('logInForm.password.placeholder')} type="password" label={t('logInForm.password.label')} onChange={setPassword}/>
                    <p className="login-no-account">{t('logInForm.noAccount')} <b onClick={() => history.push('/register')}>{t('logInForm.createAccountNow')}</b></p>
                    <p className="login-no-account">{t('logInForm.forgottenPassword')} <b onClick={() => history.push('/askForPasswordChange')}>{t('logInForm.resetPasswordNow')}</b></p>
                    <div style={{width: "50%", alignSelf: 'center'}}><Button onClick={authenticate} label={t('logInForm.submitLabel')}/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}

export default Login;