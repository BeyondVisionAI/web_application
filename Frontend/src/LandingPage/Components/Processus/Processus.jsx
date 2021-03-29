import React from 'react';
import "./Processus.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBrain, faFileDownload, faFileUpload, faIcons} from "@fortawesome/free-solid-svg-icons";

const Processus = () => {
    return (
        <div className="processus-container">
            <div className="step-container">
                <div className="first-step-process-container process-container">
                    <FontAwesomeIcon icon={faFileUpload} className="upload-icon process-icon"/>
                    <p className="process-text"><em>Uploadez</em> votre vidéo</p>
                </div>
                <div className="second-step-process-container process-container">
                    <FontAwesomeIcon icon={faBrain} className="ia-icon process-icon"/>
                    <p className="process-text"><em>Patientez</em> pendant que l'IA génère l'audiodescription</p>
                </div>
                <div className="third-step-process-container process-container">
                    <FontAwesomeIcon icon={faFileDownload} className="download-icon process-icon"/>
                    <p className="process-text"><em>Téléchargez</em> votre vidéo</p>
                </div>
            </div>
            <div className="process-title-container">
                <h2 className="process-title">Notre Processus</h2>
            </div>
        </div>
    );
}
 
export default Processus;