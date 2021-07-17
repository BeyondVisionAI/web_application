import React, {useEffect} from 'react';
import "./ProjectComponent.css"
import Aos from 'aos'

const ProjectComponent = (props) => {
    useEffect(() => {
        Aos.init({duration: 1500})
    }, []);

    return (
        <div data-aos="fade-left" data-aos-delay={props.delay} className="project-component-container">
            <div className="number-container">
                <h1>{props.number}</h1>
            </div>
            <h2>{props.title}</h2>
            <h3>{props.underTitle}</h3>
            <p>{props.text}</p>
        </div>
    );
}
 
export default ProjectComponent;