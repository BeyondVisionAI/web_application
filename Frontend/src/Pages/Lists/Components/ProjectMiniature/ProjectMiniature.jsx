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
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const getThumbnailUrl =  async () => {
            const url = await DownloadFileUrl('bv-thumbnail-project', project?.thumbnail?.name)
            setThumbnail(url)
        }
        getThumbnailUrl()
    }, []);

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
            <img src={thumbnail} className='project-card-image'/> 
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