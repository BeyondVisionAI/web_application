import { useEffect, useRef, useCallback, useState, useContext } from "react";
import CollaboratorsButton from "../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton";
import { toast } from 'react-toastify';
import FolderListSelectable from "./Components/FolderListSelectable";
import "./ProjectDrawer.css"
import { FaPen, FaTrash, FaPlus, FaCheck} from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import axios from "axios";
import InputWithLabel from "../../../../GenericComponents/InputWithLabel/InputWithLabel";
import ThumbnailEditable from "./Components/ThumbnailEditable";
import { UploadFileOnS3 } from "../../../../GenericComponents/Files/S3Manager";
import CollaboratorInput from "../../../../GenericComponents/InputWithLabel/CollaboratorInput";
import { AuthContext } from "../../../../GenericComponents/Auth/Auth";
import SVGLogos from '../../../../GenericComponents/SVGLogos/SVGLogos';
import { useTranslation } from 'react-i18next';

const ProjectDrawer = ({project, isOpen, closeDrawer, addToFolderList, removeProjectFromList, editProject, folderList}) => {
    const { t } = useTranslation('translation', {keyPrefix: 'project.details'});
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs'});
    const divRef = useRef(null)
    const [lineCount, setLineCount] = useState(0)
    const [showMore, setShowMore] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [title, setTitle] = useState(project?.name)
    const [description, setDescription] = useState(project?.description)
    const [thumbnail, setThumbnail] = useState(project?.thumbnailUrl || '/login-image.jpg')
    const [collaborators, setCollaborators] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const {currentUser} = useContext(AuthContext)

    useEffect(() => {
      const idx = collaborators.findIndex((item) => item.userId === currentUser.userId)
      if (idx !== -1) {
          setUserRole(collaborators[idx].rights);
      }
  }, [collaborators, currentUser]);

    useEffect(() => {
        async function getCollaborators () {
            try {
                const collaborators = await axios({
                    url: `${process.env.REACT_APP_API_URL}/projects/${project._id}/collaborations`,
                    method: 'GET',
                    withCredentials: true,
                })
                setCollaborators(collaborators.data);
            } catch (err) {
                toast.error(tErr('collaborator.getCollaborators'));
                setCollaborators([])
            }
        }
        getCollaborators();
    }, [ project ])

    useEffect(() => {
      if (project?.description) {
        setDescription(project?.description)
        if (project?.description?.length > 800) {
            setLineCount(40)
        } else {
            setLineCount(0)
        }
      }
    }, [project?.description]);

    useEffect(() => {
      if (project?.name) setTitle(project?.name)
    }, [project?.name]);

    useEffect(() => {
      if (project?.thumbnailUrl) setThumbnail(project?.thumbnailUrl);
      else setThumbnail('/login-image.jpg')
    }, [project?.thumbnailUrl]);

    useEffect(() => {
        function handleClickOutside(event) {
          const elements = document.getElementsByClassName('project-card-drawer-trigger')
          if (divRef.current && !divRef.current.contains(event.target)) {
            let isClosed = true;
            for (const element of elements) {
              if (element.contains(event.target)) {
                isClosed = false;
              }
            }
            if (isEdit) {
              handleEditCancel()
              setIsEdit(false);
            }
            if (isClosed) {
              closeDrawer();
            }
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [divRef]);

      const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
          if (isEdit) {
            handleEditCancel()
            setIsEdit(false);
          }
          closeDrawer()
        }
      }, []);
      useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, []);

      const handleDelete = async () => {
        if (window.confirm(`You are about to delete the project ${project?.name}. Please confirm this action !`)) {
          try {
            await axios({
              url: `${process.env.REACT_APP_API_URL}/projects/${project?._id}`,
              method: 'DELETE',
              withCredentials: true,
            })
            removeProjectFromList(project._id);
            closeDrawer()
          } catch (e) {
            toast.error(tErr('project.deleteProject'));
          }
        }
      }

      const handleEditSave = async () => {
        try {
          let updatedProject = {}
          let data = {}
          if (thumbnail !== '/login-image.jpg' && thumbnail !== project?.thumbnailUrl) {
            const imageRes = await UploadFileOnS3(thumbnail, 'bv-thumbnail-project', 'us-east-1', `${project._id}.${thumbnail.name.split(".").pop()}`)
            const thumbnailResponse = await axios({
              method: 'POST',
              withCredentials: true,
              url: `${process.env.REACT_APP_API_URL}/images`,
              data: {
                name: imageRes.Key,
                desc: `Thumbnail for ${project.name} locate in ${imageRes.bucket} bucket`,
                ETag: imageRes.ETag
              }
            })
            updatedProject['thumbnail'] = thumbnailResponse.data
            data['thumbnailId'] = thumbnailResponse.data._id;
          }
          if (title !== project?.name) data['name'] = title;
          if (description !== project?.description) data['description'] = description;
          const updatedProjectResponse = await axios({
            method: 'PATCH',
            withCredentials: true,
            url: `${process.env.REACT_APP_API_URL}/projects/${project._id}`,
            data: data
          })
          updatedProject = {...project, ...updatedProject, ...updatedProjectResponse.data}
          editProject(updatedProject)
        setIsEdit(false)
        } catch (error) {
          toast.error(tErr("saveError"));
          setIsEdit(false)

        }
      }

      const handleEditCancel = () => {
        setDescription(project?.description);
        setTitle(project?.name)
        if (project?.thumbnailUrl) setThumbnail(project?.thumbnailUrl);
        else setThumbnail('/login-image.jpg')
        setIsEdit(false)
      }

    return (
        <div ref={divRef} className={`project-drawer-container ${isOpen && 'project-drawer-container-active'}`}>
          <div className="project-drawer-editor-icons-container">
            {['OWNER', 'ADMIN', 'WRITE'].includes(userRole) && <a className="project-drawer-editor-icon-container" href={`/project/${project?._id}/edit`}><FiScissors className="project-drawer-editor-icon"/></a>}
            {isEdit ?
            <>
              <div className="project-drawer-editor-icon-container" onClick={handleEditCancel}><FaPlus className="project-drawer-editor-icon icon-rotate"/></div>
              <div className="project-drawer-editor-icon-container" onClick={handleEditSave}><FaCheck className="project-drawer-editor-icon"/></div>
            </>
            :
            ['OWNER', 'ADMIN'].includes(userRole) && <div className="project-drawer-editor-icon-container" onClick={() => setIsEdit(true)}><FaPen className="project-drawer-editor-icon"/></div>}
            {['OWNER', 'ADMIN'].includes(userRole) && 
              <div className="project-drawer-editor-icon-container-error" onClick={handleDelete}><FaTrash className="project-drawer-editor-icon-error"/></div>
            }
          </div>
            <div className="project-drawer-thumbnail-container">
              <ThumbnailEditable editThumbnail={setThumbnail} isEditable={isEdit} thumbnailUrl={thumbnail}/>
            </div>
            <div className="project-drawer-content">
                {isEdit ? <InputWithLabel fullWidth type="text" onChange={setTitle} defaultValue={title} /> : <h1 className="project-drawer-title">{title}</h1>}
                <CollaboratorInput setCollaborators={setCollaborators} projectId={project?._id} isEditable={isEdit} collaborators={collaborators} />
                <h2 className="project-drawer-sub-title">{t('description.label')}</h2>
                {isEdit ? <InputWithLabel fullWidth type="textarea" onChange={setDescription} defaultValue={description} /> : 
                  lineCount > 15 ?
                  <p>
                    {!showMore && <p className="project-drawer-text-content" style={{maxHeight: '35vh', overflow: 'hidden'}} >{description}</p>}
                    {showMore && <p className="project-drawer-text-content">{description}</p>}
                    <p className="project-drawer-show-more" onClick={() => setShowMore(!showMore)}>Show {showMore ? 'Less' : 'More'}</p>
                  </p> :
                    <p id="project-description" className="project-drawer-text-content">{description}</p>
                }
                <h2 className="project-drawer-sub-title">{t('status.label')}</h2>
                <div className="flex flex-row inline-block align-middle project-status">
                    <SVGLogos logoType={ project?.actualStep }/>
                    <SVGLogos logoType={ project?.status }/>
                </div>
                <h2 className="project-drawer-sub-title">{t('folders.label')}</h2>
                <FolderListSelectable defaultLists={folderList || null} project={project} addToFolderList={addToFolderList ? addToFolderList : null}/>
            </div>
        </div>
    );
}
 
export default ProjectDrawer;
