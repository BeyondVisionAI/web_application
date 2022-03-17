import React from 'react';
import Projects from '../../Data/projects.json';
import "./ProjectMiniature.css";

export default function ProjectMiniature({ movie }) {

    // var collaborators = [];

    // //Generate one, two, or three icons for collaborators
    // if (actualProject.collaborators.length >= 1) {
    //     collaborators.push(<div className="rounded-full absolute circle-collab circle-one">
    //         <img className="rounded-full m-auto" src={`/assets/users/${actualProject.collaborators[0].icon}`} alt="Icon of user" />
    //     </div>);
    // }
    // if (actualProject.collaborators.length >= 2) {
    //     collaborators.push(<div className="rounded-full absolute circle-collab circle-two">
    //         <img className="rounded-full m-auto" src={`/assets/users/${actualProject.collaborators[1].icon}`} alt="Icon of user" />
    //     </div>);
    // }
    // if (actualProject.collaborators.length >= 3) {
    //     collaborators.push(<div className="rounded-full absolute circle-collab circle-three">
    //         <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    //         </svg>
    //     </div>);
    // }

    return (
        <div className="project-miniature-container">
            <div className="img-container relative">
            {/* <img className="object-fill w-full h-full" src={`./assets/movies/${actualProject.picture}`} alt={`Movie ${movie.name}`}></img> */}
            <img className="object-fill w-full h-full" src={`./assets/movies/animal.jpg`} alt={`Movie ${movie.name}`}></img>
                <div onClick={console.log("click")} className="rounded-full absolute top-3 right-3 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
            </div>
            <div className="info-container align-middle">
                <div className="inline-block align-middle project-status">
                    {
                        movie.status === "Stop" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )
                    }
                </div>
                <div className="inline-block align-middle project-infos-middle">
                    <h3 className="truncate project-title">{movie.name}</h3>
                    {/* <span className="project-last-edit">Edited {movie['last-edit']} {movie['last-edit-unit']} ago</span> */}
                </div>
                {/* <div className="inline-block align-middle relative project-collaborators h-full">
                    {collaborators}
                </div> */}
            </div>
        </div>
    )
}