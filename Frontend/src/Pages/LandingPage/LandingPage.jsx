import React from 'react';
import "./LandingPage.css"
import NavBar from './../../GenericComponents/NavBar/NavBar';
import Home from './Components/Home/Home';
import TheProject from './Components/TheProject/TheProject';
import Pricing from './Components/Pricing/Pricing';
import TheTeam from './Components/TheTeam/TheTeam';
import Contact from './Components/Contact/Contact';

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <NavBar />
            <Home />
            <TheProject />
            <Pricing />
            {/* <TheTeam /> */}
            <Contact />
        </div>
    );
}
 
export default LandingPage;