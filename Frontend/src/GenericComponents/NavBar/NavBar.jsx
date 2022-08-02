import React, { useState, useEffect } from 'react';
import "./NavBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavBar = ({ homeRef, leftButtons, middleButtons, rightButtons }) => {

    const [isMenuActive, setIsMenuActive] = useState(false)
    const [wdWidth, setWdWidth] = useState(window.innerWidth)


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
                    {renderButtons(rightButtons)}
                </div>
            </div>}
        </div>
        )
    }

    function renderButtons(buttons) {
        return buttons.map(button => {
            switch (button.type) {
                case 'LINK':
                    return <a onClick={() => setIsMenuActive(false)} href={button.href} className="navbar-link"><span>{button.texte}</span></a>
                case 'BUTTON':
                    return <button className="navbar-button" onClick={button.onClick}>{button.texte}</button>
                default:
                    break;
            }
        });
    }

    return (
        <div className="navbar-container">
            <div className="navbar-logo-container">
                <a href={homeRef}>
                <img src="/assets/Logos/Logo small BV.svg" alt="Beyond Vision logo" className="navbar-logo"/>
                </a>
            </div>
            <div className="navbar-links-container">
                {renderButtons(rightButtons)}
            </div>
        </div>
    );
}

export default NavBar;