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
import AddFolderModal from './Components/AddFolderModal/AddFolderModal';
import BreadCrumbs from '../../GenericComponents/BreadCrumbs/BreadCrumbs';
export default function Lists() {

    const [recentProjects, setRecentProjects] = useState([1, 2])
    const [folders, setFolders] = useState([1, 2, 3])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isProjectCreationModelOpen, setIsProjectCreationModalOpen] = useState(false)
    const [isFolderCreationModelOpen, setIsFolderCreationModalOpen] = useState(false)

    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        return (clearAllBodyScrollLocks)
    }, []);

    useEffect(() => {
        // TODO: Fetch Recent Projects
        // TODO: Fetch Folders
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

    const handleOpenProjectModal = () => {
        const bodyElement = document.getElementById('dashboard-container')
        disableBodyScroll(bodyElement)
        setIsProjectCreationModalOpen(true)
    }

    const handleCloseProjectModal = () => {
        const bodyElement = document.getElementById('dashboard-container')
        enableBodyScroll(bodyElement)
        setIsProjectCreationModalOpen(false)
    }

    const handleOpenFolderModal = () => {
        const bodyElement = document.getElementById('dashboard-container')
        disableBodyScroll(bodyElement)
        setIsFolderCreationModalOpen(true)
    }

    const handleCloseFolderModal = () => {
        const bodyElement = document.getElementById('dashboard-container')
        enableBodyScroll(bodyElement)
        setIsFolderCreationModalOpen(false)
    }
    console.log("🚀 ~ file: Lists.jsx ~ line 106 ~ Lists ~ isFolderCreationModelOpen", isFolderCreationModelOpen)

    return (
        <div id="dashboard-container" className="dashboard-container">
            {/* <NavBarVariante input={input} updateInput={(input) => setInput(input)}/> */}
            <ProjectDrawer project={selectedProject} isOpen={isDrawerOpen} closeDrawer={handleCloseDrawer}/>
            {isProjectCreationModelOpen && (
                <CreateProject
                    show={isProjectCreationModelOpen}
                    onHide={handleCloseProjectModal}
                />
            )}
            {isFolderCreationModelOpen && (
                <AddFolderModal
                    closeModal={handleCloseFolderModal}
                />
            )}
            <BreadCrumbs pathObject={[{url: '/dashboard', name: 'Dashboard'}]} />
            <div className='dashboard-inner-container'>
                <h1 className='dashboard-inner-container-title'>Recent Projects</h1>
                <div className='dashboard-cards-container'>
                    <ProjectMiniature isAdd openAddProject={handleOpenProjectModal} />
                    {recentProjects.map((project, idx) => {
                        if (idx < 3) {
                            return <ProjectMiniature project={project} openDrawer={() => handleOpenDrawer(project)} />
                        }
                    })}
                </div>
                <h1 className='dashboard-inner-container-title'>Folders</h1>
                <div className='dashboard-folder-container'>
                    <FolderCard isAdd openAddFolder={handleOpenFolderModal}/>
                    {folders.map(folder => {
                        return <FolderCard folder={folder} />
                    })}
                </div>
            </div>
        </div>
    )
}