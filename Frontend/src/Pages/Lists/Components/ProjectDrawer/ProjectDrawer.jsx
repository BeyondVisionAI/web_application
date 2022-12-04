import { useEffect, useRef, useCallback, useState } from "react";
import CollaboratorsButton from "../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton";
import { toast } from 'react-toastify';
import FolderListSelectable from "./Components/FolderListSelectable";
import "./ProjectDrawer.css"
import { FaPen, FaTrash, FaPlus, FaCheck} from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import axios from "axios";
import InputWithLabel from "../../../../GenericComponents/InputWithLabel/InputWithLabel";
import ThumbnailEditable from "./Components/ThumbnailEditable";

function getStyle(el,styleProp)
{
    var x = document.getElementById(el);
    if (!x) return null
    if (x?.currentStyle)
        var y = x?.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
    return y;
}

function countLines() {
  var el = document.getElementById('project-description');
  var divHeight = el?.offsetHeight
  var lineHeight = parseInt(getStyle('project-description', 'line-height'));
  var lines = divHeight / lineHeight;
  return lines
}

const ProjectDrawer = ({project, isOpen, closeDrawer, addToFolderList, removeProjectFromList}) => {
    const divRef = useRef(null)
    const [lineCount, setLineCount] = useState(0)
    const [showMore, setShowMore] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [title, setTitle] = useState(project?.name)
    console.log("🚀 ~ file: ProjectDrawer.jsx:36 ~ ProjectDrawer ~ title", title)
    const [description, setDescription] = useState(project?.description)

    useEffect(() => {
      if (project?.description) {
        setDescription(project?.description)
        setLineCount(countLines())
      }
    }, [project?.description]);

    useEffect(() => {
      if (project?.name) setTitle(project?.name)
    }, [project?.name]);

    useEffect(() => {
        function handleClickOutside(event) {
          if (divRef.current && !divRef.current.contains(event.target)) {
            closeDrawer();
            setIsEdit(false)
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [divRef]);

      const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
          setIsEdit(false)
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
            toast.error("Could not delete this project");
          }
        }
      }

      const handleEditSave = async () => {
        alert("Save")
        setIsEdit(false)
      }

      const handleEditCancel = () => {
        setDescription(project?.description);
        setTitle(project?.title)
        setIsEdit(false)
      }

    return (
        <div ref={divRef} className={`project-drawer-container ${isOpen && 'project-drawer-container-active'}`}>
          <div className="project-drawer-editor-icons-container">
            <a className="project-drawer-editor-icon-container" href={`/project/${project?._id}/edit`}><FiScissors className="project-drawer-editor-icon"/></a>
            {isEdit ? 
            <>
              <div className="project-drawer-editor-icon-container" onClick={handleEditCancel}><FaPlus className="project-drawer-editor-icon icon-rotate"/></div>
              <div className="project-drawer-editor-icon-container" onClick={handleEditSave}><FaCheck className="project-drawer-editor-icon"/></div>
            </>
            :
            <div className="project-drawer-editor-icon-container" onClick={() => setIsEdit(true)}><FaPen className="project-drawer-editor-icon"/></div>}
            <div className="project-drawer-editor-icon-container-error" onClick={handleDelete}><FaTrash className="project-drawer-editor-icon-error"/></div>
          </div>
            <div className="project-drawer-thumbnail-container">
              <ThumbnailEditable isEditable={isEdit} thumbnailUrl={project?.thumbnail ? project?.thumbnailUrl : '/login-image.jpg'}/>
            </div>
            {/* <div className="project-drawer-editor-container">
                <CollaboratorsButton projectId={project?._id} isEditable/>
            </div> */}
            {/* TODO: Replace by component of Dimitri */}
            <div className="project-drawer-content">
                {isEdit ? <InputWithLabel fullWidth type="text" onChange={setTitle} defaultValue={title} /> : <h1 className="project-drawer-title">{project?.name}</h1>}
                <h2 className="project-drawer-sub-title">Description</h2>
                {isEdit ? <InputWithLabel fullWidth type="textarea" onChange={setDescription} defaultValue={description} /> : 
                  lineCount > 15 ?
                  <p>
                    {!showMore && <p className="project-drawer-text-content" style={{maxHeight: '35vh', overflow: 'hidden'}}>{project?.description}</p>}
                    {showMore && <p className="project-drawer-text-content">{project?.description}</p>}
                    <p className="project-drawer-show-more" onClick={() => setShowMore(!showMore)}>Show {showMore ? 'Less' : 'More'}</p>
                  </p> :
                    <p id="project-description" className="project-drawer-text-content">{project?.description}</p>
                }
                <h2 className="project-drawer-sub-title">Folders</h2>
                <FolderListSelectable project={project} addToFolderList={addToFolderList ? addToFolderList : null}/>
            </div>
        </div>
    );
}
 
export default ProjectDrawer;