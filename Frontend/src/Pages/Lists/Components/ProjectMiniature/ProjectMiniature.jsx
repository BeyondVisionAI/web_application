import React, { useContext } from 'react';
import "./ProjectMiniature.css";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';
import { DownloadFileUrl } from '../../../../GenericComponents/Files/S3Manager';
import CollaboratorsButton from '../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton';
import ProfilePic from '../../../../GenericComponents/ProfilePic/ProfilePic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ProjectMiniature({ project, openDrawer, isAdd, openAddProject }) {
    if (isAdd) {
        return (
        <div className='project-card-container project-card-container-centered' onClick={openAddProject}>
            <FontAwesomeIcon icon={faPlus} />
            <p>Create a new project</p>
        </div>
        )
    }

    return (
       <div className='project-card-container project-card-drawer-trigger' onClick={openDrawer}>
            <img src={project?.thumbnail ? project.thumbnailUrl : '/login-image.jpg'} className='project-card-image'/> 
            <div className='project-card-floating-collaborators'>
                <CollaboratorsButton projectId={project?._id} />
            </div>
            <div className='project-card-last-editor-container'>
                <ProfilePic initials={`${project.owner.firstName[0]}${project.owner.lastName[0]}`} label={`${project.owner.firstName} ${project.owner.lastName}`} />
                {/* <p className='project-card-last-edit-time'>UN MOIS PLUS TOT</p>  */}
            </div>
            <div className="project-card-title-container">
                <p>{project.name}</p>
            </div>
       </div>
    )
}