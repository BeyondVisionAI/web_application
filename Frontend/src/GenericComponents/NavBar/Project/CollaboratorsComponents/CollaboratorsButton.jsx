import axios from 'axios';
import { useState, useEffect } from 'react';
import "./CollaboratorsButton.css"
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BounceLoader } from 'react-spinners';

export default function CollaboratorsButton( { projectId, isEditable } ) {
    // const [notifications, setNotifications] = useState(0);
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.collaborator'});
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
                toast.error(tErr("getCollaborators"));
                setCollaborators([])
            }
        }
        getCollaborators();
    }, [ projectId ])

    if (!collaborators) {
        return <BounceLoader color='#7793ed'/>;
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