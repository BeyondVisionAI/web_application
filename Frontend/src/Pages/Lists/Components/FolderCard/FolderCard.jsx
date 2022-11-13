import React from 'react';
import "./FolderCard.css";
import { useHistory } from 'react-router-dom';
import ProfilePic from '../../../../GenericComponents/ProfilePic/ProfilePic';

export default function FolderCard({ folder }) {
    const history = useHistory();

    return (
       <div className='folder-card-container'>
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