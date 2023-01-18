import "./ProjectMiniature.css";
import CollaboratorsButton from '../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton';
import ProfilePic from '../../../../GenericComponents/ProfilePic/ProfilePic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function ProjectMiniature({ project, openDrawer, isAdd, openAddProject }) {
    const { t } = useTranslation('translation', {keyPrefix: 'dashboard.projects'});
    
    if (isAdd) {
        return (
        <div className='project-card-container project-card-container-centered' onClick={openAddProject}>
            <FontAwesomeIcon icon={faPlus} />
            <p>{t('add')}</p>
        </div>
        )
    }

    return (
       <div className='project-card-container project-card-drawer-trigger' onClick={openDrawer}>
            <img src={project?.thumbnail ? project.thumbnailUrl : '/login-image.jpg'} className='project-card-image' alt=""/> 
            <div className='project-card-floating-collaborators'>
                <CollaboratorsButton projectId={project?._id} />
            </div>
            <div className='project-card-last-editor-container'>
                <ProfilePic initials={`${project.owner.firstName[0]}${project.owner.lastName[0]}`} label={`${project.owner.firstName} ${project.owner.lastName}`} />
                {/* <p className='project-card-last-edit-time'>UN MOIS PLUS TOT</p>  */}
            </div>
            <div className="project-card-title-container">
                <p>{project.name}</p>
            </div>
       </div>
    )
}