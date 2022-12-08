import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import "./NavBar.css"
import { AuthContext } from '../Auth/Auth';
import I18nSelectionButton from './I18nSelectionButton/I18nSelectionButton';

const NavBar = ({ homeRef, rightButtons, others }) => {
    const {currentUser, logout} = useContext(AuthContext);
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
                    {rightButtons && renderButtons(rightButtons)}
                </div>
            </div>}
        </div>
        )
    }

    function renderButtons(buttons) {
        if (!buttons) return;
        return buttons.map(button => {
            switch (button.type) {
                case 'LINK':
                    return <a key={button.texte} onClick={() => setIsMenuActive(false)} href={button.href} className="navbar-link"><span>{button.texte}</span></a>
                case 'BUTTON':
                    return <button key={button.texte} className="navbar-button" onClick={button.onClick}>{button.texte}</button>
                default:
                    break;
            }
            return <></>;
        });
    }

    return (
        <div className="navbar-container">
            <div className="navbar-logo-container">
                <a href={homeRef}>
                <img src="/assets/Logos/Logo small BV.svg" alt="Beyond Vision logo" className="navbar-logo"/>
                </a>
            </div>
            {rightButtons && (
                <div className="navbar-links-container">
                    {renderButtons(rightButtons)}
                </div>)}
            {others}
            <I18nSelectionButton/>
        </div>
    );
}

export default NavBar;
