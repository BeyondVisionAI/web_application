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

export default function EditCollaborators({ projectId, collaborators, setCollaborators, onHide }) {
    const wrapperRef = useRef(null);

    axios.defaults.withCredentials = true;
    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    onHide();
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    useOutsideAlerter(wrapperRef);

    const changeCollaborator = (collaboratorId, change) => {
        let collaboratorsUpdate = [...collaborators];
        let target = collaboratorsUpdate.findIndex(collaborator => collaborator.collaboration._id === collaboratorId);

        collaboratorsUpdate[target].changes = change;
        return {collaboratorsUpdate, target};
    }

    const deleteCollaboration = (collaboratorId) => {
        let {collaboratorsUpdate} = changeCollaborator(collaboratorId, Change.kickChanges);

        setCollaborators(collaboratorsUpdate);
    }

    const changeCollaboratorsRight = (collaboratorId, right) => {
        let { collaboratorsUpdate, target } = changeCollaborator(collaboratorId, Change.rightsChanges);

        collaboratorsUpdate[target].collaboration.rights = right;
        collaboratorsUpdate[target].collaboration.titleOfCollaboration = right;
        setCollaborators(collaboratorsUpdate);
    }
    // TODO : Verification about changing rights

    const changeRight = async (collaborator, right) => {
        try {
            if (right === 'KICK') {
                deleteCollaboration(collaborator.collaboration._id);
            } else {
                changeCollaboratorsRight(collaborator.collaboration._id, right);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const addCollaborator = (event) => {
        event.preventDefault();

        try {
            axios.post(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`, { email: event.target[0].value, titleOfCollaboration: 'Read', rights: 'READ'})
            .then(async ({data}) => {
                let collaboratorsUpdate = [...collaborators];
                let user = await axios.get(`${process.env.REACT_APP_API_URL}/user/${data.userId}`);

                collaboratorsUpdate.push({ user: user.data, collaboration: data, changes: 0 });
                setCollaborators(collaboratorsUpdate);
            })
        } catch (error) {
            console.error(error);
        }
    }

    const editRights = (collaborator) => {
        let rights = ['OWNER', 'ADMIN', 'WRITE', 'READ', 'KICK'];

        return (
            <select className="role-select-container" name='right' id={collaborator.collaboration._id} onChange={(e) => changeRight(collaborator, e.target.value)}>
                {rights.map(right => {
                    return (
                        <option className="role-select-option" value={right} selected={ collaborator.collaboration.rights === right }>
                            { right }
                        </option>
                    );
                })}
            </select>
        );
    }

    const pushData = () => {
        collaborators.forEach(async (collaborator) => {
            let resp = null;
            try {
                switch (collaborator.changes) {
                    case Change.rightsChanges:
                        resp = await axios.patch(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations/${collaborator.collaboration._id}`, { rights: collaborator.collaboration.rights });
                        if (resp.status === 200)
                            setCollaborators(changeCollaborator(collaborator._id, Change.noChanges).collaboratorsUpdate);
                        break;
                    case Change.kickChanges:
                        resp = await axios.delete(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations/${collaborator.collaboration._id}`);
                        if (resp.status === 204)
                            setCollaborators(changeCollaborator(collaborator._id, Change.noChanges).collaboratorsUpdate);
                        break;
                    case Change.noChanges:
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error(error)
            }
        });
        onHide()
    }

    return (
        <div key='editCollaboratorsModal'>
            <div className='justify-center'></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div ref={wrapperRef} className="flex justify-center items-center relative w-full my-6 mx-auto max-w-7xl h-5/6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-2/6 bg-white outline-none h-full focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            Collaborators
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => onHide()}
                                >
                                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                            </button>
                        </div>
                        <div className="collaborator-scrollable-container">
                        {collaborators.filter((collaborator) => collaborator.changes !== Change.kickChanges).map(collaborator => {
                            return (
                                <UserWithAction user={ collaborator.user } child={ () => editRights(collaborator) } />
                            );
                        })}
                        </div>
                        <form className="add-collaborator-container" onSubmit={addCollaborator}>
                            <label htmlFor="collaboratorEmail">Add collaborator by email:</label>
                            <input type="email" id="collaboratorEmail"/>
                            <button type='submit'>Add</button>
                        </form>
                        <button className="collaborator-save-button" onClick={() => pushData()}>Save</button>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </ div>
    );
}
