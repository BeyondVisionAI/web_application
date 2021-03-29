import React from 'react';
import "./NavBar.css"

const NavBar = () => {
    return (
        <div className="navbar-container">
            <div className="navbar-logo-container">
                <img src="/assets/logo-transparant.png" alt="Beyond Vision logo" className="navbar-logo"/>
            </div>
            <div className="navbar-links-container">
                <a href="#process" className="navbar-link">Le Processus</a>
                <a href="#prices" className="navbar-link">Tarifs</a>
                <a href="#aboutus" className="navbar-link">A Propos</a>
                <a href="#contact" className="navbar-link">Contact</a>
            </div>
        </div>
    );
}
 
export default NavBar;