import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import CustomCheckbox from '../../../../../GenericComponents/CustomCheckbox/CustomCheckbox';
import "./FolderListSelectable.css"

const FolderListSelectable = ({project, addToFolderList}) => {
    const [lists, setLists] = useState([])
    const [newListName, setNewListName] = useState('')

    useEffect(() => {
        const getLists = async () => {
            try {
                var res = await axios({
                    url: `${process.env.REACT_APP_API_URL}/lists`,
                    method: 'GET',
                    withCredentials: true,
                })
                setLists(res.data)
            } catch (e) {
                console.error(e)
            }
        }
        getLists()
    }, []);

    const handleCreateList = async () => {
        if (!newListName) return toast.error("Folder name must not be null !")
        try {
            var res = await axios({
                url: `${process.env.REACT_APP_API_URL}/lists`,
                method: 'POST',
                withCredentials: true,
                data: {
                    name: newListName,
                }
            })
            toast.success("Folder successfully created")
            setLists([...lists, res.data])
            addToFolderList(res.data)
            setNewListName('')
        } catch (error) {
            console.error(error)
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
                console.error(e)
                toast.error("Could not add this project to the list !")
            }
        } else {
            try {
                await axios({
                    method: 'DELETE',
                    url: `${process.env.REACT_APP_API_URL}/lists/${listId}/projects/${project?._id}`,
                    withCredentials: true,
                })
            } catch (e) {
                console.error(e)
                toast.error("Could not remove this project from the list !")
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