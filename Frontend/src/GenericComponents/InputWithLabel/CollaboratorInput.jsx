import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import validator from 'validator';
import axios from "axios";
import Tag from "./Tag";


function CollaboratorInput({ defaultValue, collaborators, setCollaborators }) {
    const [isValid, setIsValid] = useState(true);
    const [newCollaborator, setNewCollaborator] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        if (defaultValue) {
            setNewCollaborator(defaultValue)
        }
    }, [defaultValue]);

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
            if (collaborators.find(collaborator => collaborator.user.email === newCollaborator)) {
                toast.warning("This collaborator is already added");
                return;
            }
            let collaboratorsUpdate = [...collaborators];
            const user = await axios.post(`${process.env.REACT_APP_API_URL}/user/email`, { email: newCollaborator });

            if (user.status != 200) {
                toast.error("Error will getting user, please retry");
                return;
            }
            setNewCollaborator("");
            collaboratorsUpdate.push({ user: user.data }); // TODO: Add Rights
            setCollaborators(collaboratorsUpdate);
        } catch (error) {
            setErrorMessage('Email invalid!');
            console.error(error);
        }
    }

    const deleteCollaborator = (userId) => {
        const updatedCollaborators = collaborators.filter((collaborator) => collaborator.user._id != userId);

        setCollaborators(updatedCollaborators);
    }

    return (
        <div className="flex flex-col w-full pt-4">
            <label className="input-with-label-label">Add collaborators</label>
            <div className="flex w-full">
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

            </div>
            <div className="flex flex-wrap w-2/3 pt-1">
                {collaborators.map((collaborator) => {
                    return (
                        <Tag
                         key={collaborator.user._id}
                         text={collaborator.user.firstName}
                         onDelete={() => deleteCollaborator(collaborator.user._id)}
                        />
                    );
                })}
            </div>
            {isValid ? null: <p className="input-with-label-error">{errorMessage}</p>}
        </div>
    );
}

export default CollaboratorInput;