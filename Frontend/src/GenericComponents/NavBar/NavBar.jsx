import React from 'react';
import "./NavBar.css"

const NavBar = () => {
    return (
        <div className="navbar-container">
            <div className="navbar-logo-container">
                <a href="#home">
                <img src="/assets/Logos/Logo small BV.svg" alt="Beyond Vision logo" className="navbar-logo"/>
                </a>
            </div>
            <div className="navbar-links-container">
                <a href="#home" className="navbar-link"><span>Home</span></a>
                <a href="#project" className="navbar-link">The Project</a>
                <a href="#pricing" className="navbar-link">Pricing</a>
                <a href="#aboutus" className="navbar-link">About Us</a>
                <a href="#contact" className="navbar-link">Contact</a>
                <button className="navbar-button">Login</button>
            </div>
        </div>
    );
}
 
export default NavBar;