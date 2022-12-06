import React, { useContext } from 'react';
import "./ProjectMiniature.css";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';
import { DownloadFileUrl } from '../../../../GenericComponents/Files/S3Manager';
import SVGLogos from '../../../../GenericComponents/SVGLogos/SVGLogos';

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

    const stepImage = () => {
        if (movie.actualStep === "") {

        } else if (movie.actualStep === "") {

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
            <div className="flex flex-row info-container align-middle">
                <div className="flex flex-row inline-block align-middle project-status">
                    <SVGLogos logoType={movie.actualStep}/>
                    <SVGLogos logoType={movie.status}/>
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