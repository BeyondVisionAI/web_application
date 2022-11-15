import axios from 'axios';
import { useState, useEffect } from 'react';
import EditCollaborators from './EditCollaborators';
import "./CollaboratorsButton.css"

export default function CollaboratorsButton( { projectId, isEditable } ) {
    // const [notifications, setNotifications] = useState(0);
    const [modalShow, setShowModal] = useState(false);
    const [collaborators, setCollaborators] = useState(null);

    useEffect(() => {
        async function getCollaborators () {
            try {
                let newCollaborators = [];
                let collaborations = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`);

                for (let collaboration of collaborations.data) {
                    let user = await axios.get(`${process.env.REACT_APP_API_URL}/user/${collaboration.userId}`);

                    newCollaborators.push({ user: user.data, collaboration: collaboration, changes: 0 });
                }
                setCollaborators(newCollaborators);
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
                 <div className="collaborator-item">AG</div>
                 <div className="collaborator-item">DC</div>
                    {collaborators.map((collaborator, idx) => {
                        if (idx < 2) {
                            return (
                                <div key={idx} className="collaborator-item">{collaborator.user.firstName[0]}{collaborator.user.lastName[0]}</div>
                            )
                        } else {
                            return null;
                        }
                    })}
                    {isEditable && <div className="collaborator-item">+</div>}
                </div>
            {/* <button onClick={ () => setShowModal(true) }>Collaborators</button> */}
            {modalShow &&
                (<EditCollaborators
                    projectId={ projectId }
                    collaborators={ collaborators }
                    setCollaborators= { setCollaborators }
                    onHide={ () => setShowModal(false) }
                />)
            }
        </div>
    )
}

// const collaboration = new Schema({
//     projectId: {
//         type: Schema.Types.ObjectId,
//         ref: "Project",
//         required: true
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     titleOfCollaboration: String,
//     rights: {
//         type: String,
//         enum : Role,
//         default: Role.ADMIN
//     }
// });


// const user = new mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     password: String,
//     email: String,
//     isEmailConfirmed: { type :Boolean, default: false },
//     verificationUID: { type: String, default: uuidv4() }
//   });