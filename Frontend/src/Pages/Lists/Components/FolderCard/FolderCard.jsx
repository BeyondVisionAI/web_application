import React from 'react';
import "./FolderCard.css";
import { useHistory } from 'react-router-dom';
import ProfilePic from '../../../../GenericComponents/ProfilePic/ProfilePic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function FolderCard({ folder, isAdd, openAddFolder }) {
    const history = useHistory();

    if (isAdd) {
        return (
            <div className='folder-card-container folder-card-container-centered' onClick={openAddFolder}>
                <FontAwesomeIcon icon={faPlus} />
                <p>Add a new folder</p>
            </div>
        )
    }

    const handleClick = () => {
        history.push(`/dashboard/${folder?.id}`)
    }
    
    // TODO: Replace with value from folder
    return (
       <div className='folder-card-container' onClick={handleClick}>
            <div className="folder-card-title-container">
                <p>Folder #1</p>
            </div>
            <div className='folder-card-last-editor-container'>
                <ProfilePic initials="NB" label="Nicole Borretaz" />
                <p className='folder-card-last-edit-time'>UN MOIS PLUS TOT</p>
            </div>
       </div>
    )
}