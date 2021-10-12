import React, { useState } from 'react';
import ReactModal from 'react-modal';
import ManageCollaborators from '../../GenericComponents/Collaborator/ManageCollaborators';

export default function Project() {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => { setShowModal(true) }
    const handleCloseModal = () => { setShowModal(false) }

    return (
        <div>
            <button onClick={handleOpenModal}>See collaborator</button>
            <ReactModal
                isOpen={showModal}
                contentLabel="Minimal Modal Example"
            >
                <ManageCollaborators projectID="project1" />
                <button onClick={handleCloseModal}>Close</button>
            </ReactModal>
        </div>
    )
}
