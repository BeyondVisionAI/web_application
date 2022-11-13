import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import "./NavBar.css"
import { AuthContext } from '../Auth/Auth';
import { useTranslation } from 'react-i18next';
import availableLanguages from '../../core/i18n/availableLng';

const NavBar = ({ homeRef, rightButtons, others }) => {
    const {currentUser, logout} = useContext(AuthContext);
    const [isMenuActive, setIsMenuActive] = useState(false)
    const [wdWidth, setWdWidth] = useState(window.innerWidth)
    const { t, i18n } = useTranslation();
    const [isI18nMenuActive, setIsI18nMenuActive] = useState(false)

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

    function getI18nButton() {
        const selectedLanguage = availableLanguages.find(availableLanguage => (availableLanguage.code === i18n.language))
        if (selectedLanguage === undefined)
            return <button onClick={() => {setIsI18nMenuActive(!isI18nMenuActive)}}>language</button>;
        return (
            <button onClick={() => {setIsI18nMenuActive(!isI18nMenuActive)}}>
                <img src={selectedLanguage.flagSrc} width="28" height="16"/>
            </button>
        )
    }

    function renderI18nMenu() {
        return (
            <div className="i18n-dropdown">
                <div className="i18n-dropdown-btn">
                    {getI18nButton()}
                </div>
                {
	              isI18nMenuActive && (
                    <ul className="i18n-dropdown-menu">
                        {
                            availableLanguages.map(availableLanguage => (
                                <li className="i18n-dropdown-content">
                                <button
                                    className={(availableLanguage.code === i18n.language) ? "i18n-selected-link" : "navbar-link"}
                                    onClick={()=>{i18n.changeLanguage(availableLanguage.code)}}>
                                    <img src={availableLanguage.flagSrc} width="28" height="16"/>
                                    {availableLanguage.label}
                                </button>
                            </li>    
                            ))
                        }
                    </ul>
	              )
                }
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
            {renderI18nMenu()}
            {currentUser && <FontAwesomeIcon style={{marginLeft: '-10vw', color: 'red', cursor:'pointer'}} icon={faSignOutAlt} onClick={logout} />}
        </div>
    );
}

export default NavBar;