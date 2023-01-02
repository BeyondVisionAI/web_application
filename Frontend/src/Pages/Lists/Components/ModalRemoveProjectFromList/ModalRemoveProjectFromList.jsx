import React, { useEffect, useState } from 'react';
import "./ModalRemoveProjectFromList.css";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTranslate } from 'react-i18next';

export default function ModalRemoveProjectFromList({ refresh, open, close, projectId, listId }) {
    const { tErr } = useTranslate('translation', {keyPrefix: 'errMsgs'});

    const closeOnEscapeKeydown = (e) => {
        if ((e.charCode || e.keyCode) === 27) {
            close();
        }
    }

    const [projectName, setProjectName] = useState("");
    const [listName, setListName] = useState("");

    const removeFromList = async () => {
        let button = document.getElementById("remove-button");
        button.innerHTML = "...";

        try {
            await axios({
                method: "DELETE",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/lists/${listId}/projects/${projectId}`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error(tErr("project.deleteProjectFromList"));
        } finally {
            button.innerHTML = "Remove";
        }
    }

    useEffect(() => {
        const getProjectName = async (projectId) => {
            try {
                setProjectName("");
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/projects/${projectId}`
                });
                setProjectName(res.data.name);
            } catch (err) {
                toast.error(tErr("project.projectInfo"));
            }
        }

        const getListName = async (listId) => {
            try {
                setListName("");
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/${listId}`
                });
                setListName(res.data.name);
            } catch (err) {
                toast.error(tErr("list.listInfo"));
            }
        }

        if (projectId)
            getProjectName(projectId);
        if (listId)
            getListName(listId);

        document.body.addEventListener('keydown', closeOnEscapeKeydown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeydown);
        }
    }, [projectId]);

    if (open) {
        return (
            <div className='modal-layout' onClick={close}>
                <div className='modal-content' onClick={e => e.stopPropagation()}>
                    <div className='modal-header'>
                        <h4 className="modal-title">Remove project from List</h4>
                    </div>
                    <div className='modal-body'>
                        <p>Do you want to remove {projectName} from list {listName}</p>
                    </div>
                    <div className='modal-footer flex justify-between'>
                        <button id='remove-button' disabled={listName === "" || projectName === ""} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 rounded" onClick={removeFromList}>Remove</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 border border-red-700 rounded" onClick={close}>Cancel</button>
                    </div>

                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}