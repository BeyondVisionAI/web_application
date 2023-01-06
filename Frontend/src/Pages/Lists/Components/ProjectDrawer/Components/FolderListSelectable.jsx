import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import CustomCheckbox from '../../../../../GenericComponents/CustomCheckbox/CustomCheckbox';
import "./FolderListSelectable.css"
import { useTranslation } from 'react-i18next';

const FolderListSelectable = ({project, addToFolderList, defaultLists}) => {
    const { t } = useTranslation('translation', {keyPrefix: 'errMsgs'});
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs'});
    const [lists, setLists] = useState([])
    const [newListName, setNewListName] = useState('')

    const getLists = async () => {
        try {
            var res = await axios({
                url: `${process.env.REACT_APP_API_URL}/lists`,
                method: 'GET',
                withCredentials: true,
            })
            setLists(res.data)
        } catch (e) {
            toast.error(tErr('list.fetchAllLists'));
        }
    }

    useEffect(() => {
        if (defaultLists) {
            setLists(defaultLists)
        } else {
            getLists()
        }
    }, [defaultLists]);

    const handleCreateList = async () => {
        if (!newListName) return toast.error(tErr("folder.folderNameNull"));
        try {
            var res = await axios({
                url: `${process.env.REACT_APP_API_URL}/lists`,
                method: 'POST',
                withCredentials: true,
                data: {
                    name: newListName,
                }
            })
            toast.success(t("dashboard.folders.sucessMessage"));
            setLists([...lists, res.data])
            addToFolderList(res.data)
            setNewListName('')
        } catch (error) {
            toast.error(tErr("list.createList"));
        }
    }

    const handleCheckbox = async (checkboxStatus, listId) => {
        if (checkboxStatus === true) {
            try {
                await axios({
                    method: 'POST',
                    url: `${process.env.REACT_APP_API_URL}/lists/${listId}/projects/${project?._id}`,
                    withCredentials: true,
                })
            } catch (e) {
                toast.error(tErr("list.addProjectToList"));
            }
        } else {
            try {
                await axios({
                    method: 'DELETE',
                    url: `${process.env.REACT_APP_API_URL}/lists/${listId}/projects/${project?._id}`,
                    withCredentials: true,
                })
            } catch (e) {
                toast.error(tErr("project.deleteProjectFromList"));
            }
        }
    }

    const isProjectInList = (list) => {
        for (const projectL of list.projects) {
            if (project?._id === projectL?.projectId) return true
        }
        return false
    }

    return (
        <div className='folder-list-selectable-container'>
            <div className='folder-list-selectable-options-container'>
                {lists.map((list) => {
                return (
                        <CustomCheckbox label={list?.name} onChange={(e) => handleCheckbox(e, list?._id)} defaultState={isProjectInList(list)} style={{height: '6vh'}}/>
                    )
                })}
            </div>
            <div className='folder-list-selectable-divider' />
                <div className='folder-list-selectable-add-folder-container'>
                    <input value={newListName} type={'text'} placeholder="Create a new folder" className='folder-list-selectable-add-folder-input' onChange={(e) => setNewListName(e.target.value)}/>
                    <button className='folder-list-selectable-add-folder-add-button' onClick={handleCreateList}>+</button>
                </div>
        </div>
    );
}
 
export default FolderListSelectable;