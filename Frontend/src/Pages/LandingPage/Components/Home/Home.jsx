import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import "./Home.css"
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div href="home" id="home" className="home-container">
            <div className="home-left-side">
                <h1>{t("Audio Description")}</h1>
                <h2>{t("made easy")}</h2>
                <p>We created a new way to produce audio description using AI</p>
                <button>Join us now !</button>
            </div>
            <div className="home-video">
                <div className="video-player">
                    <FontAwesomeIcon className="icon" icon={faPlayCircle} />
                </div>
            </div>
        </div>
    );
}
 
export default Home;