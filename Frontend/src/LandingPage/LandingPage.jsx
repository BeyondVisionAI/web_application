import React from 'react';
import "./LandingPage.css"
import NavBar from './../GenericComponents/NavBar/NavBar';
import Presentation from './Components/Presentation/Presentation';
import Processus from './Components/Processus/Processus';

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <NavBar />
            <Presentation />
            <Processus />
        </div>
    );
}
 
export default LandingPage;