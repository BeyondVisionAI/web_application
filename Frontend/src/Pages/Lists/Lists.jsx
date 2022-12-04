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
import { HiArrowNarrowRight } from "react-icons/hi";
import { DownloadFileUrl } from '../../GenericComponents/Files/S3Manager';
export default function Lists() {

    const [recentProjects, setRecentProjects] = useState([])
    const [folders, setFolders] = useState([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isProjectCreationModelOpen, setIsProjectCreationModalOpen] = useState(false)
    const [isFolderCreationModelOpen, setIsFolderCreationModalOpen] = useState(false)

    useEffect(() => {
        return (clearAllBodyScrollLocks)
    }, []);

    useEffect(() => {
        const getLists = async () => {
            try {
                var res = await axios({
                    url: `${process.env.REACT_APP_API_URL}/lists`,
                    method: 'GET',
                    withCredentials: true,
                })
                setFolders(res.data)
            } catch (e) {
                console.error(e)
            }
        }
        const getRecentProjects = async () => {
            try {
                var res = await axios({
                    url: `${process.env.REACT_APP_API_URL}/projects`,
                    method: 'GET',
                    withCredentials: true,
                    params: {
                        limit: 3
                    }
                })
                var projects = [...res.data];
                for (const project of projects) {
                    project['thumbnailUrl'] = await DownloadFileUrl('bv-thumbnail-project', project?.thumbnail?.name)
                }
                setRecentProjects(projects)
            } catch (e) {
                console.error(e)
            }
        }
        getLists()
        getRecentProjects()
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

    const removeFolderFromList = (id) => {
        const idx = folders.findIndex((obj) => obj._id === id);
        if (idx === -1) return;
        const newList = [...folders];
        newList.splice(idx, 1)
        setFolders(newList)
    }

    const addToProjectList = (project) => {

    }

    const removeProjectFromList = (projectId) => {
        const idx = recentProjects.findIndex(item => item._id === projectId);
        if (idx !== -1) {
            let projectsCopy = [...recentProjects];
            projectsCopy.splice(idx, 1);
            setRecentProjects(projectsCopy)
            console.log("🚀 ~ file: Lists.jsx:119 ~ removeProjectFromList ~ projectsCopy", projectsCopy)
        }
    }

    return (
        <div id="dashboard-container" className="dashboard-container">
            <ProjectDrawer project={selectedProject} isOpen={isDrawerOpen} closeDrawer={handleCloseDrawer} addToFolderList={(folder) => setFolders([...folders, folder])}
            removeProjectFromList={removeProjectFromList}/>
            {isProjectCreationModelOpen && (
                <CreateProject
                    show={isProjectCreationModelOpen}
                    onHide={handleCloseProjectModal}
                    addToProjectList={addToProjectList}
                />
            )}
            {isFolderCreationModelOpen && (
                <AddFolderModal
                    closeModal={handleCloseFolderModal}
                    addToFolderList={(folder) => setFolders([...folders, folder])}
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
                <div className='dashboard-see-all-projects-container'>
                    <a className='dashboard-see-all-projects-content' href='/projects'>
                        <p>See all projects</p>
                        <HiArrowNarrowRight className='dashboard-see-all-projects-icon'/>
                    </a>
                </div>
                <h1 className='dashboard-inner-container-title'>Folders</h1>
                <div className='dashboard-folder-container'>
                    <FolderCard isAdd openAddFolder={handleOpenFolderModal}/>
                    {folders.map(folder => {
                        return <FolderCard folder={folder} removeFromList={removeFolderFromList}/>
                    })}
                </div>
            </div>
        </div>
    )
}