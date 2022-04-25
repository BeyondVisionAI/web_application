import React, { useEffect, useState } from 'react';
import NavBar from '../../../GenericComponents/NavBar/NavBar';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Description from './Widgets/Description';
import ProjectStatus from './Widgets/ProjectStatus';
import Options from './Widgets/Options';
import Bill from './Widgets/Bill';
import VideoPlayer from './Widgets/VideoPlayer';

export default function ManageProject(props) {
    const [project, setProject] = useState(null);
    const history = useHistory();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        async function getProject(id) {
            try {
                let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`);

                setProject({
                    title: projectR.data.name,
                    status: projectR.data.status,
                    actualStep: projectR.data.actualStep,
                    thumbnailId: projectR.data.thumbnailId,
                    videoUrl: projectR.data.url,
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

// TODO :
//   Indentation du text, récupération des: collabo, invoices, bouton mode edit, on load
//   Cancel scroll barre
//   Modification de la nav bar
//   Mettre un temps de chargement quand la donnée n'est pas disponible

    if (project) {
        return (
            <div className='w-full h-screen bg-myWhite'>
                <NavBar />
                <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => RedirectToEdit()}>Edit</button>
                <div className='flex w-full h-screen'>
                    <div className='w-2/3 h-full'>
                        <Description
                            projectId={props.match.params.id}
                            title={project.title}
                            description={project.description}
                            thumbnailId={project.thumbnailId}
                        />
                        <VideoPlayer
                            videoUrl={project.videoUrl}
                        />
                    </div>
                    <div className='h-full w-1/3 rounded-xl'>
                        <ProjectStatus
                            actualStep={project.actualStep}
                        />
                        <Options
                            projectId={props.match.params.id}
                        />
                        <Bill />
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