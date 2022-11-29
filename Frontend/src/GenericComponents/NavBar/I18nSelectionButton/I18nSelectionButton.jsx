import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import availableLanguages from '../../../core/i18n/availableLng';

const I18nSelectionButton = () => {
    const { i18n } = useTranslation();
    const [isI18nMenuActive, setIsI18nMenuActive] = useState(false)

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

export default I18nSelectionButton;
