import React, { useEffect, useState } from 'react';
import "./ModalAddProjectToList.css";
import { toast } from 'react-toastify';
import axios from 'axios';
import InputWithLabel from '../../../../GenericComponents/InputWithLabel/InputWithLabel';
import { useTranslate } from 'react-i18next';

export default function ModalAddProjectToList({ refresh, open, close, projectId }) {
    const { tErr } = useTranslate('translation', {keyPrefix: 'errMsgs.list'});
    const [customLists, setCustomLists] = useState([]);
    const [listToAdd, setListToAdd] = useState(-1);
    const [newListName, setNewListName] = useState("");

    const closeOnEscapeKeydown = (e) => {
        if ((e.charCode || e.keyCode) === 27) {
            close();
        }
    }

    const addToList = async () => {
        let button = document.getElementById("create-button");
        button.innerHTML = "...";

        try {
            await axios({
                method: "POST",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/lists/${listToAdd}/projects/${projectId}`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error(tErr("addProjectToList"));
        } finally {
            button.innerHTML = "Add"
        }
    };

    const createNewList = async () => {
        let button = document.getElementById("new-list-button");
        button.innerHTML = "...";

        try {
            const res = await axios({
                method: "POST",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/lists`,
                data: {
                    name: newListName
                }
            });
            await axios({
                method: "POST",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/lists/${res.data._id}/projects/${projectId}`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error(tErr("createList"));
        } finally {
            button.innerHTML = "Add"
        }
    };

    const setList = (listId) => setListToAdd(listId);

    useEffect(() => {
        const getAllCustomLists = async () => {
            try {
                setCustomLists([]);
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists`,
                });
                res.data.forEach(list => {
                    setCustomLists(prev => ([
                        ...prev,
                        {
                            id: list._id,
                            name: list.name,
                            movies: list.projects
                        }
                    ]))
                });
            } catch (err) {
                toast.error(tErr("fetchAllLists"));
            }
        };

        getAllCustomLists();
        document.body.addEventListener('keydown', closeOnEscapeKeydown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeydown);
        }
    }, []);

    if (open) {
        return (
            <div className='modal-layout' onClick={close}>
                <div className='modal-content' onClick={e => e.stopPropagation()}>
                    <div className='modal-header'>
                        <h4 className="modal-title">Add to a list</h4>
                    </div>
                    <div className='modal-body'>
                        <div className='grid grid-flow-col'>
                            <InputWithLabel placeholder="Your new list name" type="text" onChange={setNewListName} />
                            <button id='new-list-button' disabled={newListName === ""} className={newListName === "" ? "bg-gray-100 cursor-not-allowed text-black font-bold py-2 px-5 border border-gray-700 rounded" : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 rounded"} onClick={createNewList}>Add</button>
                        </div>
                        <button></button>
                        <div className="overflow-auto max-h-60 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {
                                customLists.map((list, index) => (
                                    <button key={index} onFocus={() => { setList(list.id) }} type="button" className="w-full px-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                        {list.name}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className='modal-footer flex justify-between'>
                        <button id='create-button' disabled={listToAdd === -1} className={listToAdd === -1 ? "bg-gray-100 cursor-not-allowed text-black font-bold py-2 px-5 border border-gray-700 rounded" : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 rounded"} onClick={addToList}>Add</button>
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