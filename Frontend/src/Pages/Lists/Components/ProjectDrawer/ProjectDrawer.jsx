import { useEffect, useRef, useCallback } from "react";
import CollaboratorsButton from "../../../../GenericComponents/NavBar/Project/CollaboratorsComponents/CollaboratorsButton";
import FolderListSelectable from "./Components/FolderListSelectable";
import "./ProjectDrawer.css"
import { FaPen } from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
const ProjectDrawer = ({project, isOpen, closeDrawer}) => {
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
            <div className="project-drawer-editor-icon-container"><FiScissors className="project-drawer-editor-icon"/></div>
            <div className="project-drawer-editor-icon-container"><FaPen className="project-drawer-editor-icon"/></div>
          </div>
            <img src='https://lumiere-a.akamaihd.net/v1/images/image_83011738.jpeg?region=0,0,540,810' className='project-drawer-thumbnail'/>
            <div className="project-drawer-editor-container">
                <CollaboratorsButton projectId={project?._id} isEditable/>
            </div>
            <div className="project-drawer-content">
                <h1 className="project-drawer-title">Star Wars 1 - La Menace Fantome</h1>
                <h2 className="project-drawer-sub-title">Description</h2>
                <p className="project-drawer-text-content">Lorem ipsum dolor sit amet. Et ratione asperiores aut quam praesentium eum tenetur architecto qui iure voluptate est atque quisquam et voluptatem quidem et fugit sapiente. Hic nisi est sunt maxime et necessitatibus internos At perferendis saepe et quae molestiae automnis corporis et fugit earum. Id Quis voluptatem ex voluptatum commodi eos iusto rerum sed dolorem autem qui incidunt Quis!</p>
                <h2 className="project-drawer-sub-title">Folders</h2>
                <FolderListSelectable project={project} />
            </div>
            
        </div>
    );
}
 
export default ProjectDrawer;