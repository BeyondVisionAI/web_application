import React from 'react';
import "./LandingPage.css"
import Home from './Components/Home/Home';
import TheProject from './Components/TheProject/TheProject';
import Pricing from './Components/Pricing/Pricing';
import TheTeam from './Components/TheTeam/TheTeam';
import Contact from './Components/Contact/Contact';
import Timeline from './Components/Timeline/Timeline';
import NavBar from './../../GenericComponents/NavBar/NavBar';

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <NavBar />
            <Home />
            <TheProject />
            <Pricing />
            <TheTeam />
            <Timeline />
            <Contact />
        </div>
    );
}
 
export default LandingPage;