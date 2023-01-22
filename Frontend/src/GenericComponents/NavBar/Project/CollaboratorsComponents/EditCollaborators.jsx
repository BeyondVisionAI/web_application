import { useRef } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import "./EditCollaborators.css"

export default function EditCollaborators({ projectId, collaborators, isModalOpen, closeModal }) {
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
