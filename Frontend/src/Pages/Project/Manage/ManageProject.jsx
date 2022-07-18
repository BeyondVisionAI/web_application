import React, { useEffect, useState } from 'react';
import NavBar from '../../../GenericComponents/NavBar/NavBar';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Description from './Widgets/Description';
import ProjectStatus from './Widgets/ProjectStatus';
import Options from './Widgets/Options';
import Bill from './Widgets/Bill';
import VideoPlayer from './Widgets/VideoPlayer';
import { Downloader } from '../../../GenericComponents/Files/Downloader';

const EDIT = {
    off: 0,
    on: 1,
    update: 2
}

export default function ManageProject(props) {
    const [project, setProject] = useState(null);
    const [editing, setEditing] = useState(EDIT.off);
    const history = useHistory();

    // const playerRef = React.useRef(null);
    // const handlePlayerReady = (player) => {
    //   playerRef.current = player;

    //   player.on('waiting', () => {
    //     player.log('player is waiting');
    //   });
    //   player.on('dispose', () => {
    //     player.log('player will dispose');
    //   });
    // };

    axios.defaults.withCredentials = true;
    useEffect(() => {
        async function getProject(id) {
            try {
                let videoUrl = undefined;
                let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`);
                try {
                    let video = await axios.get(`${process.env.REACT_APP_API_URL}/videos/${id}/${projectR.data.videoId}`);

                    if (video.status === 200)
                        videoUrl = `https://d10lu3tsncvjck.cloudfront.net/${video.data.name}`;
                } catch (error) {
                    console.log('Video non dispo');
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
                    <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => RedirectToEdit()}>Editor</button>
                    <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => setEditing(EDIT.on)}>Configurations</button>
                </>
            );
        return (
            <>
                <button className="bg-myBlack text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => setEditing(EDIT.off)}>Cancel</button>
                <button className="bg-myBlue text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => setEditing(EDIT.update)}>Done</button>
            </>
        );
    };

// TODO :
//   Indentation du text, récupération des: collabo, invoices, bouton mode edit, on load
//   Cancel scroll barre
//   Modification de la nav bar
//   Mettre un temps de chargement quand la donnée n'est pas disponible

    if (project) {
        return (
            <div className='w-full h-screen bg-myWhite'>
                <NavBar />
                {editMode()}
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
                            // onReady={handlePlayerReady}
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
                {/*TODO bien placé les bouttons et ne pas les affiché si il n'existe pas */}
                <Downloader type='video-finished-products' projectId={props.match.params.id} fileName={`Video.mp4`} fileType='video/mp4' label='Download Video' donwload/>
                <Downloader type='audio-finished-products' projectId={props.match.params.id} fileName={`Audio.mp3`} fileType='audio/mpeg' label='Download Audio' donwload/>
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