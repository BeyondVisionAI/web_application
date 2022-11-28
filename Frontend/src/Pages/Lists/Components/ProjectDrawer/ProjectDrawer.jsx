import { useEffect, useRef, useCallback, useState } from "react";
import CollaboratorsButton from "../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton";
import FolderListSelectable from "./Components/FolderListSelectable";
import "./ProjectDrawer.css"
import { FaPen, FaTrash} from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import VideoPlayer from "../../../Project/Manage/Widgets/VideoPlayer";
import { DownloadFileUrl } from "../../../../GenericComponents/Files/S3Manager";

const ProjectDrawer = ({project, isOpen, closeDrawer, addToFolderList}) => {
    const divRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
          if (divRef.current && !divRef.current.contains(event.target)) {
            closeDrawer();
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [divRef]);

      const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
          closeDrawer()
        }
      }, []);
      useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, []);

    return (
        <div ref={divRef} className={`project-drawer-container ${isOpen && 'project-drawer-container-active'}`}>
          <div className="project-drawer-editor-icons-container">
            <a className="project-drawer-editor-icon-container" href={`/project/${project?._id}/edit`}><FiScissors className="project-drawer-editor-icon"/></a>
            <div className="project-drawer-editor-icon-container"><FaPen className="project-drawer-editor-icon"/></div>
            <div className="project-drawer-editor-icon-container-error"><FaTrash className="project-drawer-editor-icon-error"/></div>
          </div>
            <div className="project-drawer-thumbnail-container">
              <img src={project?.thumbnailUrl} alt="project" />
            </div>
            {/* <div className="project-drawer-editor-container">
                <CollaboratorsButton projectId={project?._id} isEditable/>
            </div> */}
            {/* TODO: Replace by component of Dimitri */}
            <div className="project-drawer-content">
                <h1 className="project-drawer-title">{project?.name}</h1>
                <h2 className="project-drawer-sub-title">Description</h2>
                <p className="project-drawer-text-content">{project?.description}</p>
                <h2 className="project-drawer-sub-title">Folders</h2>
                <FolderListSelectable project={project} addToFolderList={addToFolderList ? addToFolderList : null}/>
            </div>
        </div>
    );
}
 
export default ProjectDrawer;