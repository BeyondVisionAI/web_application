import { useRef, useState } from 'react';
import axios from 'axios';
import UserWithAction from '../../../Auth/UserWithAction';
import { useEffect } from 'react';


export default function EditCollaborators({ projectId, onHide }) {
    const [collaborators, setCollaborators] = useState([]);
    const [needRefresh, setNeedRefresh] = useState(false);
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

    const changeRight = async (collaborator, right) => {
        let resp = null;

        try {
            if (right === 'KICK')
                resp = await axios.delete(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations/${collaborator.collaboration._id}`);
            else
                resp = await axios.patch(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations/${collaborator.collaboration._id}`, { rights: right });
            if (resp.status !== 200)
                console.error(resp);
            else
                setNeedRefresh(true);
        } catch (error) {
            console.error(error);
        }
    }

    const addCollaborator = (event) => {
        event.preventDefault();

        try {
            axios.post(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`, { email: event.target[0].value, titleOfCollaboration: 'Read', rights: 'READ'})
            .then(res => {
                if (res.status === 200)
                    setNeedRefresh(true);
            });

        } catch (error) {
            console.error(error);
        }
    }

    const editRights = (collaborator) => {
        let rights = ['OWNER', 'ADMIN', 'WRITE', 'READ', 'KICK'];

        return (
            <select name='right' id={collaborator.collaboration._id} onChange={(e) => changeRight(collaborator, e.target.value)}>
                {rights.map(right => {
                    return (
                        <option value={right} selected={ collaborator.collaboration.rights === right }>
                            { right }
                        </option>
                    );
                })}
            </select>
        );
    }

    useEffect(() => {
        async function getCollaborators () {
            try {
                let newCollaborators = [];
                let collaborations = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`);
                for (let collaboration of collaborations.data) {
                    let user = await axios.get(`${process.env.REACT_APP_API_URL}/user/${collaboration.userId}`);

                    newCollaborators.push({ user: user.data, collaboration: collaboration });
                }
                setCollaborators(newCollaborators);
                setNeedRefresh(false);
            } catch (err) {
                console.error(err);
            }
        };

        getCollaborators();
    }, [projectId, needRefresh])

    return (
        <div key='editCollaboratorsModal'>
            <div className='justify-center'></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div ref={wrapperRef} className="relative w-full my-6 mx-auto max-w-7xl h-5/6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none h-full focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            Members
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => onHide()}
                                >
                                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                            </button>
                        </div>
                        {collaborators.map(collaborator => {
                                return (
                                    <UserWithAction user={ collaborator.user } child={ () => editRights(collaborator) } />
                                );
                        })}
                        <form onSubmit={addCollaborator}>
                            <label for="collaboratorEmail">Add collaborator by email:</label>
                            <input type="email" id="collaboratorEmail"/>
                            <button type='submit'>Add</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </ div>
    );
}
