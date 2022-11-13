import React, { useState } from 'react';
import "./Contact.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Contact = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const { t } = useTranslation('translation', {keyPrefix: 'landingPage.contact'});

    async function sendEmail() {
        if (!name || !email || !message) {
            toast.error("Missing field to send message")
        }
        try {
            await axios({
                method: "POST",
                data: {
                    name,
                    email,
                    message
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/contactForm`,
            })
            toast.success("Email successfully sent !");
            setName("")
            setEmail("")
            setMessage("")
        } catch (e) {
            toast.error("Error while sending your email :(")
        }
    }

    return (
        <form href="contact" id="contact" className="contact-container">
            <div className="top-line">
                <div>
                    <label>{t('your-name')} *</label>
                    <input value={name} type="text" name="name" id="name" onChange={(event) => setName(event.target.value)}/>
                </div>
                <div>
                    <label>{t('your-email')} *</label>
                    <input value={email} type="email" name="email" id="email" onChange={(event) => setEmail(event.target.value)}/>
                </div>
            </div>
            <label>{t('your-message')} *</label>
            <textarea rows={8} cols={115} value={message} onChange={(event) => setMessage(event.target.value)}/>
            <button type='submit' onClick={(e) => {e.preventDefault(); sendEmail()}} className="submit-button">
                <p>{t('send')}</p>
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </form>
    );
}
 
export default Contact;