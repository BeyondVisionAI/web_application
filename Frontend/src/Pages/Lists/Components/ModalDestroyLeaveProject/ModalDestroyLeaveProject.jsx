import React, { useContext, useEffect, useState } from 'react';
import "./ModalDestroyLeaveProject.css";
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';
import { useTranslation } from 'react-i18next';

export default function ModalDestroyLeaveProject({ refresh, open, close, projectId }) {
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.project'});

    const closeOnEscapeKeydown = (e) => {
        if ((e.charCode || e.keyCode) === 27) {
            close();
        }
    }

    const [projectName, setProjectName] = useState("");
    const [role, setRole] = useState("");
    const {currentUser} = useContext(AuthContext);

    const leaveProject = async () => {
        let button = document.getElementById("quit-button");
        button.innerHTML = "...";

        try {
            await axios({
                method: "POST",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/leave`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error(tErr("leaveProject"));
        } finally {
            button.innerHTML = "Leave";
        }
    }

    const destroyProject = async () => {
        let button = document.getElementById("quit-button");
        button.innerHTML = "...";

        try {
            await axios({
                method: "DELETE",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}`
            });
            refresh(oldKey => oldKey + 1);
            close();
        } catch (e) {
            toast.error(tErr("deleteProject"));
        } finally {
            button.innerHTML = "Destroy";
        }
    }

    useEffect(() => {
        const getProjectName = async (projectId) => {
            try {
                setProjectName("");
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/projects/${projectId}`
                });
                setProjectName(res.data.name);
            } catch (err) {
                toast.error(tErr("projectInfo"));
            }
        }

        const getRoleInProject = async (projectId) => {
            try {
                setRole("");
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/collaborations`
                });
                res.data.forEach(collab => {
                    if (collab.userId === currentUser.userId) {
                        setRole(collab.rights);
                    }
                });
            } catch (err) {
                toast.error(tErr("roleInProject"));
                close();
            }
        };

        if (projectId) {
            getProjectName(projectId);
            getRoleInProject(projectId);
        }

        document.body.addEventListener('keydown', closeOnEscapeKeydown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeydown);
        }
    }, [projectId]);

    if (open) {
        return (
            <div className='modal-layout' onClick={close}>
                <div className='modal-content' onClick={e => e.stopPropagation()}>
                    <div className='modal-header'>
                        <h4 className="modal-title">{role === "OWNER" ? 'Destroy' : 'Leave'} the project</h4>
                    </div>
                    <div className='modal-body'>
                        <p>Do you want to {role === "OWNER" ? 'destroy' : 'leave'} {projectName}</p>
                    </div>
                    <div className='modal-footer flex justify-between'>
                        <button id='quit-button' disabled={projectName === "" || role === ""} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 rounded" onClick={() => {role === "OWNER" ? destroyProject() : leaveProject()}}>{role === "OWNER" ? 'Destroy' : 'Leave'}</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 border border-red-700 rounded" onClick={close}>Cancel</button>
                    </div>

                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}