import React, { useState, useEffect } from 'react'
import ProjectDrawer from '../Lists/Components/ProjectDrawer/ProjectDrawer';
import ProjectMiniature from '../Lists/Components/ProjectMiniature/ProjectMiniature';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import CreateProject from '../Project/Create/CreateProject';
import "./ProjectList.css"
import BreadCrumbs from '../../GenericComponents/BreadCrumbs/BreadCrumbs';

const ProjectList = (props) => {
    const folderId = props.match.params.listId;
    console.log("🚀 ~ file: ProjectList.jsx ~ line 11 ~ ProjectList ~ projectID", folderId)
    const [projects, setProjects] = useState([1, 2, 3, 4, 5, 6, 7])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isProjectCreationModelOpen, setIsProjectCreationModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)

    useEffect(() => {
        return (clearAllBodyScrollLocks)
    }, []);

    useEffect(() => {
        // TODO: Fetch Projects of Folder
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
    return ( 
        <div id="dashboard-container" className="dashboard-container">
            <ProjectDrawer project={selectedProject} isOpen={isDrawerOpen} closeDrawer={handleCloseDrawer}/>
            {/* <NavBarVariante input={input} updateInput={(input) => setInput(input)}/> */}
            {isProjectCreationModelOpen && (
                <CreateProject
                    show={isProjectCreationModelOpen}
                    onHide={handleCloseProjectModal}
                />
            )}
            <BreadCrumbs pathObject={[{url: '/dashboard', name: 'Dashboard'}, {url: `/dashboard:${folderId}`, name: 'Folder Name'}]} />
            <div className='dashboard-inner-container'>
            <div className='dashboard-cards-container'>
                <ProjectMiniature isAdd openAddProject={handleOpenProjectModal} />
                {projects.map(project => (
                    <ProjectMiniature project={project} openDrawer={() => handleOpenDrawer(project)} />
                ))}
                </div>
            </div>
        </div>
     );
}
 
export default ProjectList;