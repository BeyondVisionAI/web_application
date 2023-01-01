import React from 'react';
import "./FolderCard.css";
import { useHistory } from 'react-router-dom';
import ProfilePic from '../../../../GenericComponents/ProfilePic/ProfilePic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function FolderCard({ folder, isAdd, openAddFolder, removeFromList }) {
    const { t } = useTranslation('translation', {keyPrefix: 'dashboard.folders'});
    const history = useHistory();

    if (isAdd) {
        return (
            <div className='folder-card-container folder-card-container-centered' onClick={openAddFolder}>
                <FontAwesomeIcon icon={faPlus} />
                <p>{t('add.label')}</p>
            </div>
        )
    }

    const handleClick = () => {
        history.push(`/dashboard/${folder._id}`)
    }

    const handleDelete = async () => {
        try {
            await axios({
                url: `${process.env.REACT_APP_API_URL}/lists/${folder._id}`,
                method: 'DELETE',
                withCredentials: true
            })
            removeFromList(folder._id);
        } catch (e) {
            toast.error(t('delete.errorMessage'))
        }
    }

    return (
        <>
            <ContextMenuTrigger id={`context-menu-folder-${folder._id}`}>
                <div className='folder-card-container' onClick={handleClick}>
                        <div className="folder-card-title-container">
                            <p>{folder.name}</p>
                        </div>
                        <div className='folder-card-last-editor-container'>
                            <ProfilePic initials={`${folder.creator.firstName[0]}${folder.creator.lastName[0]}`} label={`${folder.creator.firstName} ${folder.creator.lastName}`} />
                            {/* <p className='folder-card-last-edit-time'>UN MOIS PLUS TOT</p> */}
                        </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={`context-menu-folder-${folder._id}`}>
                <MenuItem onClick={handleDelete}>
                    <div className='folder-card-context-menu-item-container'>
                        <FaTrash />
                        <p>{t('delete.label')}</p>
                    </div>
                    
                </MenuItem>
            </ContextMenu>
        </>
    )
}