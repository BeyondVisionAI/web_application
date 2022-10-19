import { useEffect, useState } from "react";
import "./ProjectDrawer.css"

const ProjectDrawer = ({project, isOpen, closeDrawer}) => {
    const [bodyScrollValue, setBodyScrollValue] = useState(0)

    useEffect(() => {
        setBodyScrollValue(window?.scrollY)
    }, [window?.scrollY]);

    return (
            <div style={{top: `${bodyScrollValue}px`}} className={`project-drawer-container ${isOpen && 'project-drawer-container-active'}`}>
                <button onClick={closeDrawer}>close</button>
            </div>
    );
}
 
export default ProjectDrawer;