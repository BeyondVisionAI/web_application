import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EmailVerification = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'authentication.emailVerification'});
    let location = useLocation()
    var [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        var uid = new URLSearchParams(location.search).get("verifUID");
        verifyEmail(uid)
    }, [location]);

    async function verifyEmail(uid) {
        try {
            await axios({
                method: "POST",
                data: {
                    verifId: uid,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/user/verifyEmail`,
            })
            toast.success(t('successMessage'))
            setIsFinished(true)
        } catch (err) {
            toast.error(t('errorMessage'))
            setIsFinished(true)
        }
    }

    if (!isFinished) {
        return (
            <h1>{t('label')}</h1>
        );
    } else {
        return (
            <Redirect to={"/login"} />
        )
    }
}

export default EmailVerification;