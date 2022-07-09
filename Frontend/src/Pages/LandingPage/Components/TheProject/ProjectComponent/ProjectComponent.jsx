import React, {useEffect} from 'react';
import "./ProjectComponent.css"
import Aos from 'aos'

const ProjectComponent = (props) => {
    useEffect(() => {
        Aos.init({duration: 1500, disable: 'mobile'})
    }, []);

    return (
        <div data-aos="fade-left" data-aos-delay={props.delay} className="project-component-container">
            <div className="number-container">
                <h1>{props.number}</h1>
            </div>
            <div className='text-container'>
                <h2>{props.title}</h2>
                <h3>{props.underTitle}</h3>
                <p>{props.text}</p>
            </div>
        </div>
    );
}
 
export default ProjectComponent;