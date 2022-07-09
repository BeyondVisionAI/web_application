import React from 'react';
import ProjectComponent from './ProjectComponent/ProjectComponent';
import "./TheProject.css"


const TheProject = () => {
    return (
        <div href="project" id="project" className="project-container">
                <ProjectComponent delay="0" title="Help" underTitle="Visually impaired people" number="1" text="At Beyond Vision, 
                our main goal is to help visually impaired people by giving them more choice in the content they can watch." />
                <ProjectComponent delay="500" title="Simplify" underTitle="the process of audio description" number="2" text="The process of creating audio description
                for a movie or a televised show is time
                consuming and very costly. For independant
                filmmakers it’s almost impossible to make 
                your content available to visually impaired people.
                Here, at Beyond Vision, we want to give the 
                possibility to every content creator to get their content audio descripted." />
                <ProjectComponent delay="1000" title="Propel" underTitle="a new way to treat images" number="3" text="One of our biggest goal is to create an
                Artificial Intelligence that is able to extract
                meaning from short video clips. This technology could change the audio description field if it came to fruition." />
        </div>
    );
}
 
export default TheProject;