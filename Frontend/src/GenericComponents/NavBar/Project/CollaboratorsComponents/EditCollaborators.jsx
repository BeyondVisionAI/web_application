import { useRef } from 'react';
import axios from 'axios';
import UserWithAction from '../../../Auth/UserWithAction';
import { useEffect } from 'react';
import "./EditCollaborators.css"

const Change = {
    noChanges: 0,
    rightsChanges: 1,
    kickChanges: 2
}

export default function EditCollaborators({ projectId, collaborators, isModalOpen, closeModal }) {
    console.log("🚀 ~ file: EditCollaborators.jsx ~ line 14 ~ EditCollaborators ~ collaborators", collaborators)
    console.log("🚀 ~ file: EditCollaborators.jsx ~ line 34 ~ EditCollaborators ~ isModalOpen", isModalOpen)
    const wrapperRef = useRef(null);
    axios.defaults.withCredentials = true;

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    closeModal();
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    useOutsideAlerter(wrapperRef);

    if (isModalOpen === false) {
        return null;
    }

    return (
        <div className='collaborator-modal-container'>
            <div ref={wrapperRef} className='collaborator-modal-content-container'>
                <h1>Hello World</h1>
            </div>
        </div>
    );
}
