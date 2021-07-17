import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import "./Home.css"

const Home = () => {
    return (
        <div href="home" id="home" className="home-container">
            <div className="home-left-side">
                <h1>Audio Description</h1>
                <h2>made easy</h2>
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