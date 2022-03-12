import React, { useState } from 'react';
import "./Contact.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Contact = () => {
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [message, setMessage] = useState("")

    async function sendEmail() {
        if (!name || !email || !message) {
            toast.error("Missing field to send message")
        }
    }

    return (
        <div href="contact" id="contact" className="contact-container">
            <img className="contact-enveloppe" src="/Enveloppe.svg" alt="enveloppe drawing" />
            <div className="top-line">
                <div>
                    <label>Your name *</label>
                    <input type="text" name="name" id="name" onChange={(event) => setName(event.target.value)}/>
                </div>
                <div>
                    <label>Your email *</label>
                    <input type="email" name="email" id="email" onChange={(event) => setEmail(event.target.value)}/>
                </div>
            </div>
            <label>Your message *</label>
            <textarea rows={8} cols={115} value={message} onChange={(event) => setMessage(event.target.value)}/>
            <div onClick={sendEmail} className="submit-button">
                <p>Send</p>
                <FontAwesomeIcon icon={faPaperPlane} />
            </div>
        </div>
    );
}
 
export default Contact;