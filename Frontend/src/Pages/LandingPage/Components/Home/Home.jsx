import React from 'react';
import ReactPlayer from 'react-player'
import "./Home.css"
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const history = useHistory()
    const { t } = useTranslation('translation', {keyPrefix: 'landingPage'});

    return (
        <div href="home" id="home" className="home-container">
            <div className="home-left-side">
                <h1>{t("Audio Description")}</h1>
                <h2>{t("made easy")}</h2>
                <p>{t("our-gooddid")}</p>
                <button onClick={() => history.push("/")}>{t("join-us")}</button>
            </div>
            <div className="home-video">
                <ReactPlayer style={{zIndex:'0'}} controls className="video-player" url="https://dms.licdn.com/playlist/C4D05AQEongTmyGtf7g/mp4-720p-30fp-crf28/0/1612962034063?e=2147483647&v=beta&t=QBJbTIlWGSyUmO3R_t6-8pkWZI0P0FopbQv2zusI9w0" />
            </div>
        </div>
    );
}
 
export default Home;