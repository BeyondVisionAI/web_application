import React from 'react';
// import { useHistory } from 'react-router-dom';
import "./NavBar.css";

export default function NavBar({ input, setInput }) {

    // const history = useHistory()

    return (
        <div className="navbar-container">
            <div>
                <a href="#home">
                    <img src="/assets/Logos/Logo small BV.svg" alt="Beyond Vision Logo" className="navbar-logo" />
                </a>
            </div>
            <div className="input-search-container">
                <input className="input-search" placeholder="Recherchez un projet..." value={input} onChange={event => setInput(event.target.value)} />
                <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-6" fill="none" viewBox="0 0 24 24" stroke="#7793ED">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div className="user-button">
                <a href="#home">
                    <svg width="100%" height="5vh" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.7298 0.0930176C25.731 0.0930176 28.6093 1.28524 30.7315 3.40742C32.8537 5.5296 34.0459 8.40789 34.0459 11.4091C34.0459 14.4103 32.8537 17.2886 30.7315 19.4108C28.6093 21.533 25.731 22.7252 22.7298 22.7252C19.7286 22.7252 16.8503 21.533 14.7282 19.4108C12.606 17.2886 11.4137 14.4103 11.4137 11.4091C11.4137 8.40789 12.606 5.5296 14.7282 3.40742C16.8503 1.28524 19.7286 0.0930176 22.7298 0.0930176ZM22.7298 28.3832C35.2341 28.3832 45.362 33.4472 45.362 39.6993V45.3574H0.0976562V39.6993C0.0976562 33.4472 10.2256 28.3832 22.7298 28.3832Z" fill="#F6F8FF" />
                    </svg>
                </a>
            </div>
        </div>
    )
}