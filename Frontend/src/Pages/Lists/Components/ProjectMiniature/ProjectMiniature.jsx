import React, { useContext } from 'react';
import "./ProjectMiniature.css";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';
import { DownloadFileUrl } from '../../../../GenericComponents/Files/S3Manager';
import CollaboratorsButton from '../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton';
import ProfilePic from '../../../../GenericComponents/ProfilePic/ProfilePic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ProjectMiniature({ project, openDrawer, isAdd, openAddProject }) {
    const history = useHistory();

    const {currentUser} = useContext(AuthContext);

    const [thumbnail, setThumbnail] = useState('');

    if (isAdd) {
        return (
        <div className='project-card-container project-card-container-centered' onClick={openAddProject}>
            <FontAwesomeIcon icon={faPlus} />
            <p>Create a new project</p>
        </div>
        )
    }
// TODO: Replace with value from project
    return (
       <div className='project-card-container' onClick={openDrawer}>
            <img src='https://lumiere-a.akamaihd.net/v1/images/image_83011738.jpeg?region=0,0,540,810' className='project-card-image'/> 
            <div className='project-card-floating-collaborators'>
                <CollaboratorsButton projectId={project?._id} />
            </div>
            <div className='project-card-last-editor-container'>
                <ProfilePic initials="NB" label="Nicole Borretaz" /> 
                <p className='project-card-last-edit-time'>UN MOIS PLUS TOT</p> 
            </div>
            <div className="project-card-title-container">
                <p>Star Wars 1 - La Menace Fantome</p> 
            </div>
       </div>
    )
}