// import React, { useContext, useEffect, useState } from 'react';
import React, { useContext, useEffect } from 'react';
import ProjectMiniature from '../ProjectMiniature/ProjectMiniature';
import "./ProjectsList.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../GenericComponents/Auth/Auth';

export default function ProjectsList({ id, list, openAddProjectToList, openRemoveProjectFromList, openDestroyLeaveProject, openDestroyLeaveList }) {

    const { currentUser } = useContext(AuthContext);

    var projects = [];
    for (var i = 0; i < list.movies.length; i++) {
        projects.push(<ProjectMiniature className="project-miniature"
            key={i} idList={id} movie={list.movies[i]}
            openAddProjectToList={openAddProjectToList}
            openRemoveProjectFromList={openRemoveProjectFromList}
            openDestroyLeaveProject={openDestroyLeaveProject} />);
    }

    // const [roleList, setRoleList] = useState('');

    useEffect(() => {
        const getMyRoleOnList = async () => {
            if (id === "My projects" || id === "Shared with me") {
                return
            }
            try {
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/${id}/members`,
                });
                res.data.forEach(listMember => {
                    // if (listMember.userId === currentUser.userId) {
                    //     setRoleList(listMember.rights);
                    // }
                });
            } catch (err) {
                toast.error("Can't get list rights")
            }
        };

        getMyRoleOnList();
        return function cleanup() {
        };
    }, [id, currentUser.userId])

    return (
        <div>
            {
                
                (list !== undefined) &&
                <div className="main-container">
                    <div className='flex'>
                        <h3 className="list-title flex-none">{list.name}</h3>
                        {
                            id !== "My projects" && id !== "Shared with me" ?
                                <div className="rounded-full ml-2 mt-1 flex-auto relative dropdown grid justify-items-stretch">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 justify-self-start" fill="none" viewBox="0 0 24 24" stroke="#000000">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
{/*                                     
                                    <div className='dropdown-child absolute top-7'>
                                        {
                                            roleList === "OWNER" || roleList === "ADMIN" ?
                                                <p>Members</p> : null
                                        }
                                        {
                                            roleList === "OWNER" || roleList === "ADMIN" || roleList === "WRITE" ?
                                                <p>Projects</p> : null
                                        }
                                        {
                                            roleList === "OWNER" ?
                                                <p onClick={() => {openDestroyLeaveList(id)}}>Destroy the list</p> : <p onClick={() => {openDestroyLeaveList(id)}}>Leave the list</p>
                                        }
                                    </div> */}
                                </div> : <p></p>
                        }
                    </div>
                    <div className="projects-list-container">
                        {projects}
                    </div>
                </div>
            }
        </div>
    )
}