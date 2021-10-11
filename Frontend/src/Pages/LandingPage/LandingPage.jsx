import React from 'react';
import "./LandingPage.css"
import NavBar from './../../GenericComponents/NavBar/NavBar';
import Home from './Components/Home/Home';
import TheProject from './Components/TheProject/TheProject';
import Pricing from './Components/Pricing/Pricing';
import TheTeam from './Components/TheTeam/TheTeam';
import Contact from './Components/Contact/Contact';
import ManageCollaborators from '../../GenericComponents/Collaborator/ManageCollaborators';

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <ManageCollaborators projectID="project1" />
            <NavBar />
            <Home />
            <TheProject />
            <Pricing />
            <TheTeam />
            <Contact />
        </div>
    );
}
 
export default LandingPage;