import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../GenericComponents/Auth/Auth';
import { Redirect, useHistory } from 'react-router-dom';
import "./Register.css"
import validator from 'validator';
import InputWithLabel from '../../GenericComponents/InputWithLabel/InputWithLabel';
import Button from '../../GenericComponents/Button/Button';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'authentication.registerForm'});
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
            toast.error(t('errMsgs.allTheFieldsMustBeFilled'))
        } else if (password !== confirmPassword) {
            toast.error(t('errMsgs.passwordMismatch'))
        } else if(!areFieldsValid()) {
            toast.error(t('errMsgs.invalidFields'))
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
                    toast.success(t('successMessage'))
                    history.push('/login')
                }
            } catch (err) {
                if (err.response && (err.response.status === 409)) {
                    toast.error(t('errMsgs.emailAlreadyUsed'))
                } else {
                    toast.error(t('errMsgs.serverError'))
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
                    <h1 className="login-form-title">{t('title')}</h1>
                    <h2 className="login-form-under-title">{t('underTitle')}</h2>
                    <InputWithLabel errorMessage={t('email.validationFailedMsg')} verifyRegex={"email"} placeholder={t('email.placeholder')} type="email" label={t('email.label')} onChange={setEmail} />
                    <InputWithLabel errorMessage={t('name.validationFailedMsg')} verifyRegex={nameRegex} placeholder={t('name.firstname.placeholder')} type="text" label={t('name.firstname.label')} onChange={setFirstName} />
                    <InputWithLabel errorMessage={t('name.validationFailedMsg')} verifyRegex={nameRegex} placeholder={t('name.lastname.placeholder')} type="text" label={t('name.lastname.label')} onChange={setLastName} />
                    <InputWithLabel errorMessage={t('password.validationFailedMsg')} verifyRegex={passRegex} placeholder={t('password.placeholder')} type="password" label={t('password.label')} onChange={setPassword} />
                    <InputWithLabel errorMessage={t('password.validationFailedMsg')} verifyRegex={passRegex} placeholder={t('password.placeholder')} type="password" label={t('password.verifyLabel')} onChange={setConfirmPassword} />
                    <p className="login-no-account">{t('gotAccount')} <b onClick={() => history.push("/login")}>{t('logInNow')}</b></p>
                    <div style={{width: "50%", alignSelf: 'center', paddingBottom: '40px'}}><Button onClick={register} label={t('submitLabel')}/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}

export default Register;