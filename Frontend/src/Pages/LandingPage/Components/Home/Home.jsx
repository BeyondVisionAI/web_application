import React from 'react';
import ReactPlayer from 'react-player'
import "./Home.css"
import { useHistory } from 'react-router-dom';


const Home = () => {
    const history = useHistory()

    return (
        <div href="home" id="home" className="home-container">
            <div id="background">
            <div id="dash" style={{left: "-15%"}} />
                <div id="dash" style={{left: "1.55%"}}/>
                <div id="dash" style={{left: "18.1%"}}/>
                <div id="dash" style={{left: "34.65%"}}/>
                <div id="content-container">
                    <div id="home-left-side">
                        <h1>
                            Audiodescription made <span>Easy</span>
                        </h1>
                        <h3>
                            We created a new way to create Audiodescription using AI
                        </h3>
                        <button onClick={() => history.push("/")}>
                            Join us now!
                        </button>
                    </div>
                    <div className="home-video">
                        <ReactPlayer style={{zIndex:'0'}} controls className="video-player" url="https://dms.licdn.com/playlist/C4D05AQEongTmyGtf7g/mp4-720p-30fp-crf28/0/1612962034063?e=2147483647&v=beta&t=QBJbTIlWGSyUmO3R_t6-8pkWZI0P0FopbQv2zusI9w0" />
                    </div>
                </div>
            </div>
        </div>
    //     <div href="home" id="home" className="home-container">
    //     <div className="home-left-side">
    //         <h1>Audio Description</h1>
    //         <h2>made easy</h2>
    //         <p>We created a new way to produce audio description using AI</p>
    //         <button onClick={() => history.push("/")}>Join us now !</button>
    //     </div>
    //     <div className="home-video">
    //         <ReactPlayer style={{zIndex:'0'}} controls className="video-player" url="https://dms.licdn.com/playlist/C4D05AQEongTmyGtf7g/mp4-720p-30fp-crf28/0/1612962034063?e=2147483647&v=beta&t=QBJbTIlWGSyUmO3R_t6-8pkWZI0P0FopbQv2zusI9w0" />
    //     </div>
    // </div>
);
}

export default Home;