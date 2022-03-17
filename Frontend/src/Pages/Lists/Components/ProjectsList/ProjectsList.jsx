import React from 'react';
import Lists from '../../Data/lists.json';
import ProjectMiniature from '../ProjectMiniature/ProjectMiniature';
import "./ProjectsList.css";

export default function ProjectsList({ id, list }) {

    var projects = [];
    for (var i = 0; i < list.movies.length; i++) {
        projects.push(<ProjectMiniature className="project-miniature" key={i} movie={list.movies[i]} />);
    }

    return (
        <div>
            {
                (list !== undefined) &&
                <div className="main-container">
                    <h3 className="list-title">{list.name}</h3>
                    <div className="projects-list-container">
                        {projects}
                    </div>
                </div>
            }
        </div>
    )
}