import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReplicaDetails from './Components/ReplicaDetails';
import EmptyReplicaDetails from './Components/EmptyReplicaDetails';
import Timeline from './Components/Timeline';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Chat from '../Chat/Chat';
import NavBarVariante from '../../GenericComponents/NavBar/Project/NavBarVariante';
import VideoPlayer from '../Project/Manage/Widgets/VideoPlayer';
import AudioPlayer from './Components/AudioPlayer';
import CircleButton from '../../GenericComponents/Button/CircleButton';
import './ScriptEdition.css';
import { DownloadFileUrl } from '../../GenericComponents/Files/S3Manager';
import { AuthContext } from '../../GenericComponents/Auth/Auth';


export default function ScriptEdition(props) {

    const {socket, currentUser} = useContext(AuthContext);

    const [replicas, setReplicas] = useState([]);
    const [project, setProject] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [replicaSelected, setReplicaSelected] = useState(null);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [newSecondsFromCursor, setNewSecondsFromCursor] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const history = useHistory();

    useMemo(() => {
        socket.on('connection', () => {
            console.log(`I'm connected with the back-end for the script edition`);
        });
    
        socket.on('new replica', async (newReplica) => {
            setReplicas([...replicas, newReplica])
        });
    
        socket.on('update replica', async (replica) => {
            console.log("🚀 ~ file: ScriptEdition.jsx:43 ~ socket.on ~ replica", replica)
            updateReplica(replica);
        });
    
        socket.on('delete replica', async (replica) => {
            removeReplica(replica._id);
        });
    }, [socket, replicas])

    
    socket.on('replica detected', async () => {
        try {
            const res = await axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/projects/${props.match.params.id}/replicas`,
                withCredentials: true
            });
            let resRep = Object.values(res.data);
            setReplicas(resRep);
        } catch (e) {
            console.log('error detected when call new replica in front')
        }
    });

    useEffect(() => {
        socket.emit("open project", props.match.params.id);
        const getProject = async function (id) {
            try {
                let videoUrl = undefined;
                let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`, { withCredentials: true });
                try {
                    let video = await axios.get(`${process.env.REACT_APP_API_URL}/videos/${id}/${projectR.data.videoId}`, { withCredentials: true });

                    if (video.status === 200)
                        videoUrl = await DownloadFileUrl('beyondvision-vod-source-km23jds9b71q', video.data.name);
                } catch (error) {
                    console.error('Video non dispo');
                }
                // videoUrl = '/Marco_Destruction.mp4'
                setProject({
                    id: id,
                    title: projectR.data.name,
                    videoUrl: videoUrl
                    // status: projectR.data.status
                });
            } catch (error) {
                console.error(error);
            }
        }

        getProject(props.match.params.id)
        return (() => {
            socket.emit("close project", props.match.params.id);
        })
    }, [props.match.params.id]);

    const updateReplicaAction = async (selectedId) => {
        setReplicaSelected(selectedId);
    }

    const getReplicaFromId = (id) => {
        for (var i = 0; i < replicas.length; i++) {
            if (replicas[i]._id === id) {
                return replicas[i];
            }
        }
        return null;
    }

    const updateReplica = (newReplica) => {
        const idx = replicas.findIndex((item) => item._id === newReplica._id)
        if (idx !== -1) {
            var newReplicas = [...replicas]
            newReplicas[idx] = newReplica;
            setReplicas(newReplicas)
        }
    }

    const removeReplica = (replicaID) => {
        var newReplicas = [...replicas];
        const index = newReplicas.findIndex((item) => item._id === replicaID);
        if (index !== -1) {
            newReplicas.splice(index, 1)
        }
        setReplicas(newReplicas);
        setReplicaSelected(null);
    }


    useEffect(() => {
        const fetchProjectDetails = async (id) => {
            try {
                const res = await axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API_URL}/projects/${id}/replicas`,
                    withCredentials: true
                });
                let resRep = Object.values(res.data);
                setReplicas(resRep);
            } catch (e) {
                let errMsg = "Error";
                switch (e.response.status) {
                    case 401:
                        switch (e.response.data) {
                            case "USER_NOT_LOGIN": errMsg = "Error (401) - User is not logged in."; break;
                            /* errors that fits the 403 to me */
                            case "PROJECT_NOT_YOURS": errMsg = "Error (401) - No collaboration found between the userId and the project."; break;
                            default: errMsg = "Error (401)."; break;
                        } break;
                    case 403: errMsg = "Error (403) - User has no right to access the content."; break;
                    case 404:
                        switch (e.response.data) {
                            case "PROJECT_NOT_FOUND": errMsg = "Error (404) - Missing project."; break;
                            case "REPLICA_NOT_FOUND": errMsg = "Error (404) - Missing replica."; break;
                            default: errMsg = "Error (404)."; break;
                        } break;
                    default /* 500 */ : errMsg = "Internal Error."; break;
                }
                toast.error(errMsg);
                console.error(e);
            }
        }
        fetchProjectDetails(props.match.params.id);
    }, []);

    const RedirectToProjectManagement = () => {
        history.push(`/projects/`);
    }

    if (project) {
        return (
            <div className="script-edition-container h-screen w-screen overflow-x-hidden">
                <div id="page-container" className="w-screen h-5/6 py-2 px-6">
                    <div id="title" className="h-1/10 w-full flex flex-row justify-between items-center py-4">
                        <h1 className="text-blue-400 w-1/3 inline-flex items-center text-4xl">{project.title}</h1>
                        <div className='flex flex-row gap-1 pa-0'>
                            <CircleButton url="/instagram-direct.png" size='30px' onClick={() => RedirectToProjectManagement()}/>
                            <CircleButton url="/user-icon.png" size='30px'/>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 edit-bloc">
                        <div id="menu-detail" className="bg-white w-2/5 h-1/10 shadow-lg rounded-xl">
                            {replicaSelected !== null && getReplicaFromId(replicaSelected) !== null
                            ?   <ReplicaDetails replica={getReplicaFromId(replicaSelected)} updateReplica={updateReplica}/>
                            :   <EmptyReplicaDetails/>
                            }
                        </div>
                        <div id="movie-insight" className="p-2 w-3/5 rounded-xl shadow-lg">
                            <VideoPlayer
                                videoUrl={project.videoUrl}
                                setDuration={setVideoDuration}
                                setPlayedSecondsInParent={setPlayedSeconds}
                                newSecondsFromCursor={newSecondsFromCursor}
                                resetNewSecondsFromCursor={() => setNewSecondsFromCursor(null)}
                                setIsPlaying={setIsPlaying}/>
                        </div>
                    </div>

                    <div className="flex h-1/3 w-full pb-6 mt-2">
                        <Timeline
                        className="w-full h-full bg-gray-100 rounded-b-3xl opacity-50 shadow-lg"
                        playedSeconds={playedSeconds}
                        duration={videoDuration}
                        replicas={replicas}
                        projectId={project.id}
                        onReplicaSelection={updateReplicaAction}
                        updateReplica={updateReplica}
                        removeReplicaFromState={removeReplica}
                        setNewSecondsFromCursor={setNewSecondsFromCursor}
                        />
                    </div>
                    <AudioPlayer
                    replicas={replicas}
                    playedSeconds={playedSeconds}
                    newSecondsFromCursor={newSecondsFromCursor}
                    resetNewSecondsFromCursor={() => setNewSecondsFromCursor(null)}
                    triggerPause={!isPlaying}
                    />
                </div>
                {/* <Chat projectId={props.match.params.id}/> */}
            </div>
        );
    } else {
        return (
            <h1>Non</h1>
        )
    }
}
