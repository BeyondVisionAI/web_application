import { useState } from 'react';
import EditCollaborators from './EditCollaborators';

export default function CollaboratorsButton( { projectId } ) {
    // const [notifications, setNotifications] = useState(0);
    const [modalShow, setShowModal] = useState(false);

    return (
        <div>
            <button onClick={ () => setShowModal(true) }>Collaborators</button>
            {modalShow &&
                (<EditCollaborators
                    projectId={ projectId }
                    onHide={ () => setShowModal(false) }
                />)
            }
        </div>
    )
}
