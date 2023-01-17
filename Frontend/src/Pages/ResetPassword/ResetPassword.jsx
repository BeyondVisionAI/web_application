import React from 'react'
import "./ResetPassword.css"
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputWithLabel from './../../GenericComponents/InputWithLabel/InputWithLabel';
import Button from './../../GenericComponents/Button/Button';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'authentication.passwordResetForm'});
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
            toast.error(t('errMsgs.passwordMismatch'))
            return
        }
        if (!regexPassword.test(password)) {
            toast.error(t('errMsgs.validationFailedMsg'))
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
                toast.success(t('successMessage'))
                history.push('/login')
            }
        } catch {
            toast.error(t('errMsgs.serverError'))
            history.push('/login')
        }
    }

    return (
        <div className="login-container">
            <div className="login-left-container">
                <div className="login-form">
                    <h1 className="login-form-title">{t('title')}</h1>
                    <h2 className="login-form-under-title">{t('underTitle')}</h2>
                    <InputWithLabel errorMessage={t('password.validationFailedMsg')} verifyRegex={passRegex} placeholder={t('password.placeholder')} type="password" label={t('password.label')} onChange={setPassword} />
                    <InputWithLabel errorMessage={t('password.validationFailedMsg')} verifyRegex={passRegex} placeholder={t('password.placeholder')} type="password" label={t('password.verifyLabel')} onChange={setConfirmPassword} />
                    <p className="login-no-account">{t('rememberPassword')} <b onClick={() => history.push("/login")}>{t('LogInNow')}</b></p>
                    <div style={{width: "50%", alignSelf: 'center'}}><Button onClick={makeChange} label={t('submitLabel')}/></div>
                </div>
            </div>
            <div className="login-right-container">
                <img className="login-image" src="/login-image.jpg" alt="illustration bleu contenant une fleur"/>
            </div>
        </div>
    );
}

export default ResetPassword;