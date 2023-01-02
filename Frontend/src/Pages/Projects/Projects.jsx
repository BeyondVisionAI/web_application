import axios from 'axios'
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import React, { useEffect, useState } from 'react'
import BreadCrumbs from '../../GenericComponents/BreadCrumbs/BreadCrumbs'
import { DownloadFileUrl } from '../../GenericComponents/Files/S3Manager'
import ProjectDrawer from '../Lists/Components/ProjectDrawer/ProjectDrawer'
import ProjectMiniature from '../Lists/Components/ProjectMiniature/ProjectMiniature'
import CreateProject from '../Project/Create/CreateProject'
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Projects = () => {
    const { tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.project'});
    const [projects, setProjects] = useState([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isProjectCreationModelOpen, setIsProjectCreationModalOpen] = useState(false)

    useEffect(() => {
        return (clearAllBodyScrollLocks)
    }, []);

    useEffect(() => {
        const getProjects = async () => {
            try {
                var res = await axios({
                    url: `${process.env.REACT_APP_API_URL}/projects`,
                    method: 'GET',
                    withCredentials: true,
                })
                var projects = [...res.data];
                for (const project of projects) {
                    project['thumbnailUrl'] = await DownloadFileUrl('bv-thumbnail-project', project?.thumbnail?.name)
                }
                setProjects(projects)
            } catch (e) {
                toast.error(tErr("getAllProjects"));
            }
        }
        getProjects()
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

    const addToProjectList = (project) => {

    }

    const editProject = async (project) => {
        const idx = projects.findIndex((item) => item._id === project._id);
        if (idx !== - 1) {
            let projectsCopy = [...projects]
            if (project.thumbnail !== projectsCopy[idx].thumbnail) {
                project['thumbnailUrl'] = await DownloadFileUrl('bv-thumbnail-project', project?.thumbnail?.name)
            }
            projectsCopy[idx] = {...projects[idx], ...project};
            setProjects(projectsCopy)
        }
    }

    return (
        <div id="dashboard-container" className="dashboard-container">
            <ProjectDrawer editProject={editProject} project={selectedProject} isOpen={isDrawerOpen} closeDrawer={handleCloseDrawer} />
            {isProjectCreationModelOpen && (
                <CreateProject
                    show={isProjectCreationModelOpen}
                    onHide={handleCloseProjectModal}
                    addToProjectList={addToProjectList}
                />
            )}
            <BreadCrumbs pathObject={[{url: '/projects', name: 'Projects'}]} />
            <div className='dashboard-inner-container'>
                <h1 className='dashboard-inner-container-title'>Projects</h1>
                <div className='dashboard-cards-container'>
                    <ProjectMiniature isAdd openAddProject={handleOpenProjectModal} />
                    {projects.map((project, idx) => (
                        <ProjectMiniature project={project} openDrawer={() => handleOpenDrawer(project)} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Projects;