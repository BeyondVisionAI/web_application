import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import validator from 'validator';
import axios from "axios";
import Tag from "./Tag";
import { AuthContext } from "../Auth/Auth";
import { useTranslation } from 'react-i18next';

function CollaboratorInput({ defaultValue, collaborators, setCollaborators, isEditable, projectId }) {
    const { t: tWarn } = useTranslation('translation', {keyPrefix: 'warningMsgs.collaborators'})
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.collaborators'})
    const [isValid, setIsValid] = useState(true);
    const [newCollaborator, setNewCollaborator] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const {currentUser} = useContext(AuthContext)

    axios.defaults.withCredentials = true;

    useEffect(() => {
        if (defaultValue) {
            setNewCollaborator(defaultValue)
        }
    }, [defaultValue]);

    useEffect(() => {
        const idx = collaborators.findIndex((item) => item.userId === currentUser.userId)
        if (idx !== -1) {
            setUserRole(collaborators[idx].rights);
        }
    }, [collaborators, currentUser]);

    function checkValidity() {
        if (newCollaborator.length === 0) {
            setIsValid(true)
            return
        }
        if (validator.isEmail(newCollaborator)) {
            setIsValid(true)
        } else {
            setIsValid(false);
            setErrorMessage('Please enter an email');
        }
    }

    const addCollaborator = async (e) => {
        e.preventDefault();
        try {
            if (collaborators?.find(collaborator => collaborator.user.email === newCollaborator)) {
                toast.warning(tWarn("alreadyAdded"));
                return;
            }
            let collaboratorsUpdate = [...collaborators];
            const user = await axios.post(`${process.env.REACT_APP_API_URL}/user/email`, { email: newCollaborator });

            if (user.status != 200) {
                toast.error(tErr("getUser"));
                return;
            }
            var newCollab = await axios.post(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`, { email: user.data.email, titleOfCollaboration: 'Read', rights: 'READ'});

            setNewCollaborator("");
            collaboratorsUpdate.push(newCollab.data); // TODO: Add Rights
            setCollaborators(collaboratorsUpdate);
        } catch (error) {
            setErrorMessage('Email is invalid!');
            toast.error(tErr("addCollaborator"));
        }
    }

    const deleteCollaborator = async (userId) => {
        const updatedCollaborators = collaborators?.filter((collaborator) => collaborator.user._id != userId);
        const idxCollab = collaborators.findIndex((item) => item.projectId === projectId && item.userId === userId)
        if (idxCollab !== -1) {
            const collab = collaborators[idxCollab];
            try {
                axios({
                    method: 'DELETE',
                    url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations/${collab._id}`,
                })
                setCollaborators(updatedCollaborators);
            } catch (_) {
                setErrorMessage("Cannot delete the collaborator!");
                toast.error(tErr("deleteCollaborator"));
            }
        }
    }

    const handleRoleChange = async (role, userId) => {
        const idxCollab = collaborators.findIndex((item) => item.projectId === projectId && item.userId === userId)
        if (idxCollab !== -1) {
            const collab = collaborators[idxCollab];
            if (role === collab.rights) {
                return;
            }
            try {
                const res = await axios({
                    method: 'PATCH',
                    url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations/${collab._id}`,
                    data: {
                        titleOfCollaboration: role.toLowerCase(),
                        rights: role,
                    }
                })
                let newCollabs = [...collaborators]
                newCollabs[idxCollab] = {...collaborators[idxCollab], ...res.data};
                setCollaborators(newCollabs);
            } catch (_) {
                setErrorMessage("Cannot change the collaborator's role!");
                toast.error(tErr("updateCollaborator"));
            }
        }
    }

    return (
        <div className="flex flex-col w-full pt-4">
            {isEditable && <label className="input-with-label-label">Add collaborators</label>}
            {isEditable && <div className="flex w-full">
                <input
                 pattern={".+"}
                 onBlur={checkValidity}
                 placeholder="Email"
                 className="input-with-label-input w-full"
                 type="email"
                 onChange={(arg) => {
                    setNewCollaborator(arg.target.value);
                 }}
                 name="Add collaborators"
                 id="Add collaborators"
                 value={newCollaborator}
                />

                <div className="flex mt-2 mx-3">
                    <button onClick={(e) => addCollaborator(e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </button>
                </div>

            </div>}
            <div className="flex flex-wrap flex-row w-full pt-1">
                {collaborators?.map((collaborator) => {
                    return (
                        <Tag
                         key={collaborator.user._id}
                         role={collaborator.rights}
                         userRole={userRole}
                         isUser={currentUser.userId === collaborator.user._id}
                         text={`${collaborator.user.firstName} ${collaborator.user.lastName}(${collaborator.titleOfCollaboration})`}
                         onDelete={() => deleteCollaborator(collaborator.user._id)}
                         onChangeRole={(role) => handleRoleChange(role, collaborator.user._id)}
                        />
                    );
                })}
            </div>
            {isValid ? null: <p className="input-with-label-error">{errorMessage}</p>}
        </div>
    );
}

export default CollaboratorInput;
