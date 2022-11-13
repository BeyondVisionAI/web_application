import axios from 'axios';
import React from 'react'
import "./Lists.css"
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import CreateProject from '../Project/Create/CreateProject';
import ProjectDrawer from './Components/ProjectDrawer/ProjectDrawer';
import ProjectMiniature from './Components/ProjectMiniature/ProjectMiniature';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import FolderCard from './Components/FolderCard/FolderCard';
export default function Lists() {

    const [projects, setProjects] = useState([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isProjectCreationModelOpen, setIsProjectCreationModalOpen] = useState(false)

    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        return (clearAllBodyScrollLocks)
    }, []);

    useEffect(() => {
        const getMyProjects = async () => {
            try {
                // setMyProjectsList({ id: 0, name: "My projects", movies: [] });
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/mine`,
                });
                setIsFinished(true);
                setProjects(res.data)
            } catch (err) {
                toast.error("Email couldn't be verified, try again later")
                setIsFinished(true)
            }
        };
        getMyProjects()
    }, []);

    const handleOpenDrawer = (project) => {
        const bodyElement = document.getElementById('dashboard-container')
        disableBodyScroll(bodyElement)
        setSelectedProject(project)
        setIsDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        const bodyElement = document.getElementById('dashboard-container')
        enableBodyScroll(bodyElement)
        setSelectedProject(null)
        setIsDrawerOpen(false)
    }

    const handleOpenModal = () => {
        const bodyElement = document.getElementById('dashboard-container')
        disableBodyScroll(bodyElement)
        setIsProjectCreationModalOpen(true)
    }

    const handleCloseModal = () => {
        const bodyElement = document.getElementById('dashboard-container')
        enableBodyScroll(bodyElement)
        setIsProjectCreationModalOpen(false)
    }

    if (!isFinished) {
        return (
            <h1>loading...</h1>
        );
    } else {
        return (
            <div id="dashboard-container" className="dashboard-container">
                {/* <NavBarVariante input={input} updateInput={(input) => setInput(input)}/> */}

                    {/* <button
                    className="dashboard-add-project-button"
                    type="button"
                    onClick={handleOpenModal}
                    >+</button>

                {isProjectCreationModelOpen && (
                    <CreateProject
                        show={isProjectCreationModelOpen}
                        onHide={handleCloseModal}
                    />
                )} */}

                <div className='dashboard-inner-container'>
                    <h1 className='dashboard-inner-container-title'>Recent Projects</h1>
                    <ProjectDrawer project={selectedProject} isOpen={isDrawerOpen} closeDrawer={handleCloseDrawer}/>
                    <div className='dashboard-cards-container'>
                        {[...Array(4)].map(project => {
                            return <ProjectMiniature project={projects[0]} openDrawer={() => handleOpenDrawer(projects[0])} />
                        })}
                    </div>
                    <h1 className='dashboard-inner-container-title'>Folders</h1>
                    <div className='dashboard-folder-container'>
                        {[...Array(30)].map(project => {
                            return <FolderCard folder={null} />
                        })}
                    </div>
                </div>
                
                
            </div>
        )
    }
}