/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import ReplicaDetails from './Components/ReplicaDetails';
import EmptyReplicaDetails from './Components/EmptyReplicaDetails';
import Timeline from './Components/Timeline';
import axios from 'axios';
import { toast } from 'react-toastify';
import VideoPlayer from '../Project/Manage/Widgets/VideoPlayer';
import AudioPlayer from './Components/AudioPlayer';
import ImageButton from '../../GenericComponents/Button/ImageButton';
import './ScriptEdition.css';
import { DownloadFileUrl } from '../../GenericComponents/Files/S3Manager';
import { AuthContext } from '../../GenericComponents/Auth/Auth';
import AccountButton from '../../GenericComponents/Auth/AccountButton';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import FullPageLoader from '../../GenericComponents/FullPageLoader/FullPageLoader';
import BreadCrumbs from '../../GenericComponents/BreadCrumbs/BreadCrumbs';

export default function ScriptEdition(props) {
    const { t: tWarn } = useTranslation('translation', {keyPrefix: 'warningMsgs.scriptEdition'});
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs'});
    const { t: tSuc } = useTranslation('translation', {keyPrefix: 'sucMsgs'});
    const {socket} = useContext(AuthContext);
    const [replicas, setReplicas] = useState([]);
    const [project, setProject] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [replicaSelected, setReplicaSelected] = useState(null);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [newSecondsFromCursor, setNewSecondsFromCursor] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    console.log("🚀 ~ file: ScriptEdition.jsx:31 ~ ScriptEdition ~ isPlaying", isPlaying)

    const callGenerationIA = () => {
        axios.defaults.withCredentials = true;
        axios.post(`${process.env.REACT_APP_API_URL}/projects/${props.match.params.id}/generationIA`, {typeGeneration: 'ActionRetrieve'})
        .then((res) => {
            if (res.status !== 200) {
                toast.error(tErr('scriptEdition.scriptGeneration'));
            }
        })
        .catch((err) => {
            toast.error(tErr("somethingWentWrong"));
        });
    }

    const callGenerationIAFake = () => {
        axios.defaults.withCredentials = true;
        axios.post(`${process.env.REACT_APP_API_URL}/projects/${props.match.params.id}/generationIA`, {typeGeneration: 'ActionRetrieveFake'})
        .then((res) => {
            if (res.status !== 200) {
                toast.error(tErr('scriptEdition.scriptGeneration'));
            }
        })
        .catch((err) => {
            toast.error(tErr("somethingWentWrong"));
        });
    }

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

    const updateReplica = useCallback(
      (newReplica) => {
        const idx = replicas.findIndex((item) => item._id === newReplica._id)
        if (idx !== -1) {
            var newReplicas = [...replicas]
            newReplicas[idx] = newReplica;
            setReplicas(newReplicas)
        }
      },
      [replicas, setReplicas],
    )

    const removeReplica = useCallback(
      (replicaID) => {
        var newReplicas = [...replicas];
        const index = newReplicas.findIndex((item) => item._id === replicaID);
        if (index !== -1) {
            newReplicas.splice(index, 1)
        }
        setReplicas(newReplicas);
        setReplicaSelected(null);
      },
      [replicas, setReplicas, setReplicaSelected],
    )

    const updateGenerationButtons = useCallback(  
        (generationStatus) => {
            setProject({
                ...(project && project),
                ['status']: generationStatus.status
            });
            if (generationStatus.status === 'Done' && generationStatus.actualStep === 'VideoGeneration')
                toast.success(tSuc('scriptEdition.ADGenerationSuccess'));
            else if (generationStatus.status === 'Error')
                toast.error(tErr('scriptEdition.ADGenerationError'));
        }, [project]
    )

    const initSocketListener =  useCallback(() => {
        socket.on('new replica', async (newReplica) => {
            setReplicas([...replicas, newReplica])
        });

        socket.on('update replica', async (replica) => {
            updateReplica(replica);
        });

        socket.on('delete replica', async (replica) => {
            removeReplica(replica._id);
        });
        socket.on('update generation status', async(generationStatus) => {
            updateGenerationButtons(generationStatus);
        })
    }, [replicas, setReplicas, updateReplica, removeReplica, updateGenerationButtons, socket])

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
                    toast.error(tErr('project.getProject'));
                }
                setProject({
                    id: id,
                    title: projectR.data.name,
                    videoUrl: videoUrl,
                    status: projectR.data.status
                });
            } catch (error) {
                toast.error(tErr("project.updateProject"));
            }
        }

        getProject(props.match.params.id)
        return (() => {
            socket.emit("close project", props.match.params.id);
        })
    }, [props.match.params.id]);

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
                toast.error(tErr("project.projectInfo"));
            }
        }
        fetchProjectDetails(props.match.params.id);
    }, []);

    useEffect(() => {
        initSocketListener()
        return(() => {
            socket.off("new replica");
            socket.off("update replica");
            socket.off("delete replica");
            socket.off("update generation status");
        })
    }, [initSocketListener, socket]);

    const LaunchGeneration = async() => {
        try {
            toast.warning(tWarn("generationStart"));
            const res = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_API_URL}/projects/${props.match.params.id}/finishedEdition`,
                withCredentials: true
            });
            if (res.status !== 200) {
                toast.error(tErr("scriptEdition.scriptGeneration"));
            }
        } catch (error) {
            toast.error(tErr("scriptEdition.couldNotGenerate"));
        }
    }

    const DownloadFile = async() => {
        try {
            let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${props.match.params.id}`, { withCredentials: true });
            if (projectR.data.status === "Done") {
                var res = await DownloadFileUrl("bv-finish-products", `Audio/${props.match.params.id}.mp3`)
                fetch(res, {
                    method: 'GET',
                })
                .then((response) => response.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(
                    new Blob([blob]),
                  );
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute(
                    'download',
                    `${projectR.data.name}_AD.mp3`,
                  );
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                });
            }
            else {
                toast.error(tErr("scriptEdition.audioDescFileNotReady"));
            }
       
        } catch (error) {
            toast.error(tErr("scriptEdition.audioDownloadFailed"));
        }
    }

    const isEmptyRepliquas = () => {
        if (replicas.length === 0)
            return (false);
        const emptyReplicaIndex = replicas.find(r => r.content == null || r.content === "");

        return (emptyReplicaIndex === undefined);
    }

    const DownloadVideo = async() => {
        try {
            let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${props.match.params.id}`, { withCredentials: true });
            if (projectR.data.status === "Done") {
                var res = await DownloadFileUrl("bv-finish-products", `Video/${props.match.params.id}.mp4`)
                fetch(res, {
                    method: 'GET',
                })
                .then((response) => response.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(
                    new Blob([blob]),
                  );
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute(
                    'download',
                    `${projectR.data.name}_AD.mp4`,
                  );

                  document.body.appendChild(link);

                  link.click();

                  link.parentNode.removeChild(link);
                });
            }
            else {
                toast.error(tErr("scriptEdition.audioDescFileNotReady"));
            }
       
        } catch (error) {
            toast.error(tErr("scriptEdition.audioDownloadFailed"));
        }
    }

    if (project) {
        return (
            <div className="script-edition-container h-screen w-screen overflow-x-hidden">
                <div id="page-container" className="w-screen h-5/6 py-2 px-6">
                    <div className='navbar'>
                        <BreadCrumbs pathObject={[{ url: '/dashboard', name: project.title }]} />
                        <div className='flex flex-row gap-3'>
                            <button
                              className="button-container whitespace-nowrap"
                              onClick={ () => callGenerationIAFake() }
                            >
                                <div className="button-text">Générer le script</div>
                            </button>
                            {/*<button*/}
                            {/*  className="button-container whitespace-nowrap"*/}
                            {/*  onClick={() => callGenerationIA()}*/}
                            {/*>*/}
                            {/*    <div className="button-text">Générer le script</div>*/}
                            {/*</button>*/}
                            <ImageButton disabled={ (project.status === 'Done') ? (false) : (true) } type="Mp4File" onClick={ () => DownloadVideo() }/>
                            <ImageButton disabled={ (project.status === 'Done') ? (false) : (true) } type="Mp3File" onClick={ () => DownloadFile() }/>
                            <ImageButton disabled={isEmptyRepliquas() && project.status !== 'InProgress' ? (false) : (true) } type="SendArrow" size='30px' onClick={ () => LaunchGeneration() } />
                            <AccountButton/>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 edit-bloc" style={{height: '59vh'}}>
                        <div id="menu-detail" className="bg-white w-2/5 h-1/10 shadow-lg rounded-xl">
                            {replicaSelected !== null && getReplicaFromId(replicaSelected) !== null
                            ?   <ReplicaDetails replica={ getReplicaFromId(replicaSelected) } updateReplica={ updateReplica }/>
                            :   <EmptyReplicaDetails/>
                            }
                        </div>
                        <div id="movie-insight" className="p-2 w-3/5 rounded-xl shadow-lg" style={{ maxHeight: '60vh' }}>
                            <VideoPlayer
                                videoUrl={ project.videoUrl }
                                setDuration={ setVideoDuration }
                                setPlayedSecondsInParent={ setPlayedSeconds }
                                newSecondsFromCursor={ newSecondsFromCursor }
                                resetNewSecondsFromCursor={ () => setNewSecondsFromCursor(null) }
                                setIsPlaying={ setIsPlaying }/>
                        </div>
                    </div>

                    <div className="flex h-1/3 w-full pb-6 mt-2">
                        <Timeline
                        replicaSelected={replicaSelected}
                        className="w-full h-full bg-gray-100 rounded-b-3xl opacity-50 shadow-lg"
                        playedSeconds={ playedSeconds }
                        duration={ videoDuration }
                        replicas={ replicas }
                        projectId={ project.id }
                        onReplicaSelection={ updateReplicaAction }
                        updateReplica={ updateReplica }
                        removeReplicaFromState={ removeReplica }
                        setNewSecondsFromCursor={ setNewSecondsFromCursor }
                        isPlaying={isPlaying}
                        />
                    </div>
                    <AudioPlayer
                        replicas={ replicas }
                        playedSeconds={ playedSeconds }
                        newSecondsFromCursor={ newSecondsFromCursor }
                        resetNewSecondsFromCursor={ () => setNewSecondsFromCursor(null) }
                        triggerPause={ !isPlaying }
                    />
                </div>
                {/* <Chat projectId={props.match.params.id}/> */}
            </div>
        );
    } else {
        return (
            <FullPageLoader />
        )
    }
}
