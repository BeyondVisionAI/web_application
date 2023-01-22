import React, { useState, useEffect } from 'react'
import ProjectDrawer from '../Lists/Components/ProjectDrawer/ProjectDrawer';
import ProjectMiniature from '../Lists/Components/ProjectMiniature/ProjectMiniature';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import "./ProjectList.css"
import BreadCrumbs from '../../GenericComponents/BreadCrumbs/BreadCrumbs';
import axios from 'axios';
import { DownloadFileUrl } from '../../GenericComponents/Files/S3Manager';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ProjectList = (props) => {
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.project'});
    const folderId = props.match.params.listId;
    const [projects, setProjects] = useState([])
    const [folderName, setFolderName] = useState('Folder')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)

    useEffect(() => {
        return (clearAllBodyScrollLocks)
    }, []);

    useEffect(() => {
        const getProjects = async () => {
            try {
                var res = await axios({
                    url: `${process.env.REACT_APP_API_URL}/lists/${folderId}`,
                    method: 'GET',
                    withCredentials: true,
                })
                setFolderName(res.data.name)
                var projects = [...res.data.projects];
                for (const project of projects) {
                    project['thumbnailUrl'] = await DownloadFileUrl('bv-thumbnail-project', project?.thumbnail?.name)
                }
                setProjects(projects)
            } catch (e) {
                toast.error(tErr("getAllProjects"));
            }
        }
        getProjects()
    }, [folderId, tErr]);

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
            <BreadCrumbs pathObject={[{url: '/dashboard', name: 'Dashboard'}, {url: `/dahsboard/${folderId}`, name: folderName}]} />
            <div className='dashboard-inner-container'>
                <h1 className='dashboard-inner-container-title'>Projects</h1>
                <div className='dashboard-cards-container'>
                    {projects.map((project, idx) => (
                        <ProjectMiniature project={project} openDrawer={() => handleOpenDrawer(project)} />
                    ))}
                </div>
            </div>
        </div>
    )
}
 
export default ProjectList;