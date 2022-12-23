import React, { useContext, useEffect, useState } from 'react';
import "./ModalDestroyLeaveList.css";
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';

export default function ModalDestroyLeaveList({ refresh, open, close, listId }) {

    const closeOnEscapeKeydown = (e) => {
        if ((e.charCode || e.keyCode) === 27) {
            close();
        }
    }

    const [listName, setListName] = useState("");
    const [role, setRole] = useState("");
    const {currentUser} = useContext(AuthContext);

    const leaveList = async () => {
        let button = document.getElementById("quit-button");
        button.innerHTML = "...";

        try {
            await axios({
                method: "POST",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/lists/${listId}/leave`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error("Can't leave list");
        } finally {
            button.innerHTML = "Leave";
        }
    }

    const destroyList = async () => {
        let button = document.getElementById("quit-button");
        button.innerHTML = "...";

        try {
            await axios({
                method: "DELETE",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/lists/${listId}`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error("Can't destroy list");
        } finally {
            button.innerHTML = "Destroy";
        }
    }

    useEffect(() => {
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
                toast.error("Can't get list informations");
            }
        }

        const getRoleInList = async (listId) => {
            try {
                setRole("");
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/${listId}/members`
                });
                res.data.forEach(member => {
                    if (member.userId === currentUser.userId) {
                        setRole(member.rights);
                    }
                });
            } catch (err) {
                toast.error("Can't get your informations on this list");
                close();
            }
        };

        if (listId) {
            getListName(listId);
            getRoleInList(listId);
        }

        document.body.addEventListener('keydown', closeOnEscapeKeydown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeydown);
        }
    }, [listId]);

    if (open) {
        return (
            <div className='modal-layout' onClick={close}>
                <div className='modal-content' onClick={e => e.stopPropagation()}>
                    <div className='modal-header'>
                        <h4 className="modal-title">{role === "OWNER" ? 'Destroy' : 'Leave'} the list</h4>
                    </div>
                    <div className='modal-body'>
                        <p>Do you want to {role === "OWNER" ? 'destroy' : 'leave'} {listName}</p>
                    </div>
                    <div className='modal-footer flex justify-between'>
                        <button id='quit-button' disabled={listName === "" || role === ""} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 rounded" onClick={() => {role === "OWNER" ? destroyList() : leaveList()}}>{role === "OWNER" ? 'Destroy' : 'Leave'}</button>
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