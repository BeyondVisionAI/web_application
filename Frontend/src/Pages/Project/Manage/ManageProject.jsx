import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Description from './Widgets/Description';
import ProjectStatus from './Widgets/ProjectStatus';
import Options from './Widgets/Options';
import Bill from './Widgets/Bill';
import VideoPlayer from './Widgets/VideoPlayer';
import NavBarVariante from '../../../GenericComponents/NavBar/Project/NavBarVariante';

const EDIT = {
    off: 0,
    on: 1,
    update: 2
}

export default function ManageProject(props) {
    const [project, setProject] = useState(null);
    const [editing, setEditing] = useState(EDIT.off);
    const history = useHistory();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        async function getProject(id) {
            try {
                let videoUrl = null;
                let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`);
                try {
                    if (projectR.data.videoId) {
                        let video = await axios.get(`${process.env.REACT_APP_API_URL}/videos/${id}/${projectR.data.videoId}`);

                        if (video.status === 200 && video.data.url)
                            videoUrl = video.data.url;
                    }
                } catch (error) {
                    console.error(error);
                }

                setProject({
                    name: projectR.data.name,
                    status: projectR.data.status,
                    actualStep: projectR.data.actualStep,
                    thumbnailId: projectR.data.thumbnailId,
                    videoUrl: videoUrl,
                    description: projectR.data.description
                });
            } catch (error) {
                console.error(error);
            }
        }

        getProject(props.match.params.id)
    }, [props.match.params.id]);

    const RedirectToEdit = () => {
        history.push(`/project/${props.match.params.id}/edit`);
    }

    function updateProject(values) {
        let tmp = project;

        for (let v in values) {
            tmp[values[v].field] = values[v].value;
        }
        setProject(tmp);
    }

    const editMode = () => {
        if (editing === EDIT.off)
            return (
                <>
                    <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-5 mt-3 ease-linear transition-all duration-150" onClick={() => RedirectToEdit()}>Editor</button>
                    <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-5 mt-3 ease-linear transition-all duration-150" onClick={() => setEditing(EDIT.on)}>Configurations</button>
                </>
            );
        return (
            <>
                <button className="bg-myBlack text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-5 mt-3 ease-linear transition-all duration-150" onClick={() => setEditing(EDIT.off)}>Cancel</button>
                <button className="bg-myBlue text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-5 mt-3 ease-linear transition-all duration-150" onClick={() => setEditing(EDIT.update)}>Done</button>
            </>
        );
    };

// TODO :
//   Indentation du text, récupération des: invoices, bouton mode edit, on load
//   Cancel scroll barre
//   Mettre un temps de chargement quand la donnée n'est pas disponible

    if (project) {
        return (
            <div className='w-full h-screen bg-myWhite'>
                <NavBarVariante projectId={props.match.params.id} />
                <div className='w-full flex justify-center'>
                    {editMode()}
                </div>
                <div className='flex w-full h-screen'>
                    <div className='w-2/3 h-full'>
                        <Description
                            editing={editing}
                            setEditing={setEditing}
                            updateProjectValues={updateProject}
                            projectId={props.match.params.id}
                            name={project.name}
                            description={project.description}
                            thumbnailId={project.thumbnailId}
                        />
                        <VideoPlayer
                            videoUrl={project.videoUrl}
                        />
                     </div>
                     <div className='h-full w-1/3 rounded-xl'>
                         {/* <ProjectStatus
                             actualStep={project.actualStep}
                         />
                         <Options
                             projectId={props.match.params.id}
                         />
                         <Bill /> */}
                     </div>
                 </div>
             </div>
        );
    } else {
        return (
            <>
                <h1>Project not found</h1>
            </>
        );
    }
}