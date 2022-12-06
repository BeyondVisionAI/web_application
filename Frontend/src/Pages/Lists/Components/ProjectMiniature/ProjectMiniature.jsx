import React, { useContext } from 'react';
import "./ProjectMiniature.css";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';
import { DownloadFileUrl } from '../../../../GenericComponents/Files/S3Manager';

export default function ProjectMiniature({ idList, movie, openAddProjectToList, openRemoveProjectFromList, openDestroyLeaveProject }) {

    // var collaborators = [];

    // //Generate one, two, or three icons for collaborators
    // if (actualProject.collaborators.length >= 1) {
    //     collaborators.push(<div className="rounded-full absolute circle-collab circle-one">
    //         <img className="rounded-full m-auto" src={`/assets/users/${actualProject.collaborators[0].icon}`} alt="Icon of user" />
    //     </div>);
    // }
    // if (actualProject.collaborators.length >= 2) {
    //     collaborators.push(<div className="rounded-full absolute circle-collab circle-two">
    //         <img className="rounded-full m-auto" src={`/assets/users/${actualProject.collaborators[1].icon}`} alt="Icon of user" />
    //     </div>);
    // }
    // if (actualProject.collaborators.length >= 3) {
    //     collaborators.push(<div className="rounded-full absolute circle-collab circle-three">
    //         <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    //         </svg>
    //     </div>);
    // }

    const history = useHistory();

    const {currentUser} = useContext(AuthContext);

    const [roleProject, setRoleProject] = useState('');
    const [roleList, setRoleList] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const getMyRoleOnProject = async () => {
            try {
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/projects/${movie._id}/collaborations`,
                });
                res.data.forEach(collab => {
                    if (collab.userId === currentUser.userId) {
                        setRoleProject(collab.rights);
                    }
                });
            } catch (err) {
                toast.error("Can't get project rights")
            }
        };

        const getMyRoleOnList = async () => {
            if (idList === "My projects" || idList === "Shared with me") {
                return
            }
            try {
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/${idList}/members`,
                });
                res.data.forEach(listMember => {
                    if (listMember.userId === currentUser.userId) {
                        setRoleList(listMember.rights);
                    }
                });
            } catch (err) {
                toast.error("Can't get list rights")
            }
        };

        getMyRoleOnProject();
        getMyRoleOnList();
        return function cleanup() {
        };
    }, [idList, currentUser.userId, movie._id])

    useEffect(() => {
        try {
            async function getThumbnailProject(projId) {
                try {
                    let image = await axios.get(`${process.env.REACT_APP_API_URL}/images/${movie._id}/${movie.thumbnailId}`);
                    let url = await DownloadFileUrl('bv-thumbnail-project', image.data.name);
                    setThumbnail(url);
                } catch (err) {
                    console.error(`Getting file ${"thumbnailId"} on S3`, err);
                }
            }
            if (true || "thumbnailId")
                getThumbnailProject("projectId");
            console.log("movie :", movie);
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching data!');
        }
    }, []);

    const RedirectToProject = () => {
        history.push(`/project/${movie._id}`);
    }

    const statusImage = () => {
        if (movie.status === "Stop") {
            return (<svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-14 w-14" fill="none" viewBox="0 0 26 26" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-pause-circle">
                    <circle cx="13" cy="13" r="10"></circle>
                    <line x1="11" y1="16" x2="11" y2="10"></line>
                    <line x1="15" y1="16" x2="15" y2="10"></line>
                </svg>);
        } else if (movie.status === "Error") {
            return (<svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>);
        } else if (movie.status === "Done") {
            return (<svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>);
        } else if (movie.status === "InProgress") {
            return (<svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
            );
        }
    }

    return (
        <div className="project-miniature-container">
            <div className="img-container relative">
            <img className="object-fill w-full h-full" src={thumbnail} alt={`Movie ${movie.name}`} onClick={() => RedirectToProject()}></img>
            {/* <img className="object-fill w-full h-full" src={`./assets/movies/animal.jpg`} alt={`Movie ${movie.name}`}></img> */}
                <div className="rounded-full absolute top-3 right-3 dropdown grid justify-items-stretch">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 justify-self-end" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <div className='dropdown-child'>
                        <p onClick={() => {openAddProjectToList(movie._id)}}>Add to a list</p>
                        {
                            roleProject === "OWNER" ? <p onClick={() => {openDestroyLeaveProject(movie._id)}}>Destroy the project</p> : <p onClick={() => {openDestroyLeaveProject(movie._id)}}>Leave the project</p>
                        }
                        {
                            idList !=="My projects" && idList !== "Shared with me" && roleList !== "READ" ? <p onClick={() => {openRemoveProjectFromList(movie._id, idList)}}>Remove from the list</p> : null
                        }
                    </div>
                </div>
            </div>
            <div className="info-container align-middle">
                <div className="inline-block align-middle project-status">
                    { statusImage() }
                </div>
                <div className="inline-block align-middle project-infos-middle">
                    <h3 className="truncate project-title">{movie.name}</h3>
                    {/* <span className="project-last-edit">Edited {movie['last-edit']} {movie['last-edit-unit']} ago</span> */}
                </div>
                {/* <div className="inline-block align-middle relative project-collaborators h-full">
                    {collaborators}
                </div> */}
            </div>
        </div>
    )
}