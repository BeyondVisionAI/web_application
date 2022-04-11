import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "./NavBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {

    const [isMenuActive, setIsMenuActive] = useState(false)
    const [wdWidth, setWdWidth] = useState(window.innerWidth)
    const history = useHistory()


    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleResize() {
        setWdWidth(window.innerWidth)
    }

    if (wdWidth <= 425) {
        return (
        <div>
            
            {!isMenuActive && <FontAwesomeIcon className='menu-opener' icon={faBars} onClick={() => setIsMenuActive(true)}/>}
            {isMenuActive && <div className='opened-menu'>
                <p onClick={() => setIsMenuActive(false)} className="navbar-exit">x</p>
                <div className="navbar-links-container">
                    <a onClick={() => setIsMenuActive(false)} href="#home" className="navbar-link"><span>Home</span></a>
                    <a onClick={() => setIsMenuActive(false)} href="#project" className="navbar-link">The Project</a>
                    <a onClick={() => setIsMenuActive(false)} href="#pricing" className="navbar-link">Pricing</a>
                    {/* <a onClick={() => setIsMenuActive(false)} href="#aboutus" className="navbar-link">About Us</a> */}
                    {/* <a onClick={() => setIsMenuActive(false)} href="#contact" className="navbar-link">Contact</a> */}
                    <button className="navbar-button" onClick={() => history.push("/login")}>Login</button>
                </div> 
            </div>}
        </div>
        )
    }

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
                {/* <a href="#aboutus" className="navbar-link">About Us</a> */}
                <a href="#contact" className="navbar-link">Contact</a>
                <button className="navbar-button" onClick={() => history.push("/login")}>Login</button>
            </div>
        </div>
    );
}
 
export default NavBar;