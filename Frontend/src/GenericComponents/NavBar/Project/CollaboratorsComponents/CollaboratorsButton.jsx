import axios from 'axios';
import { useState, useEffect } from 'react';
import "./CollaboratorsButton.css"

export default function CollaboratorsButton( { projectId, isEditable } ) {
    // const [notifications, setNotifications] = useState(0);
    const [modalShow, setShowModal] = useState(false);
    const [collaborators, setCollaborators] = useState(null);

    useEffect(() => {
        async function getCollaborators () {
            try {
                const collaborators = await axios({
                    url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`,
                    method: 'GET',
                    withCredentials: true,
                })
                setCollaborators(collaborators.data);
            } catch (err) {
                console.error(err);
                setCollaborators([])
            }
        }
        getCollaborators();
    }, [ projectId ])

    if (!collaborators) {
        return <h1>Loading...</h1>;
    }

    return (
            <div style={{marginLeft: "auto", marginRight: "10px"}}>
                <div onClick={() => isEditable ? setShowModal(true) : null} className={`collaborator-container ${isEditable && 'editable'}`} >
                    {collaborators.map((collaborator, idx) => {
                        if (idx < 2) {
                            return (
                                <div key={idx} className="collaborator-item">{collaborator.user.firstName[0]}{collaborator.user.lastName[0]}</div>
                                )
                            } else {
                                return null;
                            }
                        })}
                        {collaborators.length >= 3 && <div className="collaborator-item">+{collaborators.length - 2}</div>}
                    {/* {isEditable && <div className="collaborator-item">+</div>} */}
                </div>
        </div>
    )
}