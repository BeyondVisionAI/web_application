import { React, useEffect, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';


import TimecodeLine from './TimecodeLine';
import ReplicaBox from './ReplicaBox';
import TimelineCursor from './TimelineCursor';

// temporary duration of a project, so we can do the timeline
// const videoLength = 3600000 / 4;
const canvasHeight = 80;
// coefficient between seconds (in ms) and pixels : 1 sec =
// var secToPxCoef = 300; // will change if zoom
const MIN_ZOOM = 30;

<<<<<<< Updated upstream
const Timeline = ({duration, replicas, projectId, onReplicaSelection, updateReplica, removeReplicaFromState, playedSeconds, setNewSecondsFromCursor}) => {
=======
const Timeline = ({duration, replicaSelected, replicas, projectId, onReplicaSelection, updateReplica, removeReplicaFromState, playedSeconds, setNewSecondsFromCursor}) => {
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.scriptEdition.replica'});
>>>>>>> Stashed changes
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);
    const [secToPxCoef, setSecToPxCoef] = useState(100);
    const [replicasPositions, setReplicasPositions] = useState([]);
    const [newReplicaTimestamp, setNewReplicaTimestamp] = useState(-1); // smh not sure how its updated, soooo
    var timecodeArray = [];
    const [currentTime, setCurrentTime] = useState(0);


    const addReplica = async function () {
        if (newReplicaTimestamp === -1) return;
        else if (newReplicaTimestamp / 1000 >= duration) {
            toast.error("Error - You cannot create a replica outside of the scope of the video.");
            return;
        }
        try {
            let body = {
                content: "",
                timestamp: newReplicaTimestamp,
                duration: 1500,
                voiceId: 1
            };
            const res = await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas`,
                data: body,
                withCredentials: true
            });
            updateReplica(res.data);
<<<<<<< Updated upstream
        } catch (err) { // TODO check
            let errLog;
            console.error("error : ", err);

            switch (err.response.status) {
                case 401:
                    switch (err.response.data) {
                        case "USER_NOT_LOGIN":
                            errLog = `Error (${err.response.status}) - User not logged in.`;
                            break;
                        case "PROJECT_NOT_YOURS":
                            errLog = `Error (${err.response.status}) - You are not the owner of this project.`;
                            break;
                        case "ROLE_UNAUTHORIZED":
                            errLog = `Error (${err.response.status}) - Invalid rights.`;
                            break;
                        default: errLog = `Error (${err.response.status}).`;
                            break;
                    }
                    break;
                case 403:
                    errLog = `Error (${err.response.status}).`;
                    break;
                case 404:
                    switch (err.reponse.data) {
                        case "PROJECT_NOT_FOUND":
                            errLog = `Error (${err.response.status}) - Project not found.`;
                            break;
                        case "REPLICA_NOT_FOUND":
                            errLog = `Error (${err.response.status}) - Replica not found.`;
                            break;
                        case "REPLICA_NOT_IN_PROJECT":
                            errLog = `Error (${err.response.status}) - Replica does not belong to the project.`;
                            break;
                            default:
                            errLog = `Error (${err.response.status}).`;
                            break;
                    }
                default/*500*/: errLog = `Error (${err.response.status}) - Internal Error.`; break;
            }

            toast.error(errLog);
=======
            onReplicaSelection(res.data._id)
            console.log("🚀 ~ file: Timeline.jsx:48 ~ addReplica ~ res.data", res.data)
        } catch (err) {
            toast.error(tErr("createReplica"));
>>>>>>> Stashed changes
        }
    }


    const removeReplica = async function () {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas/${contextSelectedReplicaId}`,
                withCredentials: true
            });
            onReplicaSelection(null);
            removeReplicaFromState(contextSelectedReplicaId);
        } catch (err) {
            let errLog;
            console.error("error : ", err);

            switch (err.response.status) {
                case 401:
                    switch (err.response.data) {
                        case "USER_NOT_LOGIN":
                            errLog = `Error (${err.response.status}) - User not logged in.`;
                            break;
                        case "PROJECT_NOT_YOURS":
                            errLog = `Error (${err.response.status}) - You are not the owner of this project.`;
                            break;
                        case "ROLE_UNAUTHORIZED":
                            errLog = `Error (${err.response.status}) - Invalid rights.`;
                            break;
                        default: errLog = `Error (${err.response.status}).`;
                            break;
                    }
                    break;
                case 403:
                    errLog = `Error (${err.response.status}).`;
                    break;
                case 404:
                    switch (err.reponse.data) {
                        case "PROJECT_NOT_FOUND":
                            errLog = `Error (${err.response.status}) - Project not found.`;
                            break;
                        case "REPLICA_NOT_FOUND":
                            errLog = `Error (${err.response.status}) - Replica not found.`;
                            break;
                        case "REPLICA_NOT_IN_PROJECT":
                            errLog = `Error (${err.response.status}) - Replica does not belong to the project.`;
                            break;
                            default:
                            errLog = `Error (${err.response.status}).`;
                            break;
                    }
                default/*500*/: errLog = `Error (${err.response.status}) - Internal Error.`; break;
            }

            toast.error(errLog);
        }
    }

    useEffect(() => {
        if (!duration) return
        const nbSeconds = duration;
        let SecToPx = 100
        const windowWidth = window.innerWidth;
        while (duration < windowWidth / SecToPx) {
            SecToPx += 100
        }
        setSecToPxCoef(SecToPx)
        for (var i = 0; i < nbSeconds; i++) {
            timecodeArray.push({
                videoLength: duration,
                secondToPixelCoef: secToPxCoef,
                minute: i,
                zoom: 1
            });
        }
    }, [duration])

    useEffect(() => {
        let rPos = []
        replicas.forEach(replica => {
            rPos.push({id: replica._id, start: replica.timestamp, end: replica.timestamp + replica.duration})
        });
        setReplicasPositions(rPos)
    }, [replicas]);


    const replicaLine = replicas.map((replica, index) => {
        console.log("🚀 ~ file: Timeline.jsx:109 ~ replicaLine ~ replica", replica)
        return (
            <ReplicaBox
<<<<<<< Updated upstream
=======
                isSelected={replica._id === replicaSelected}
                key={index}
>>>>>>> Stashed changes
                replica={replica}
                index={index}
                parameters={{secToPxCoef: secToPxCoef, timestamp: currentTime}}
                onReplicaSelection={onReplicaSelection}
                setSelectedRepId={setSelectedRepId}
                updateReplica={updateReplica}
                videoDuration={duration}
                replicasPositions={replicasPositions}
            />
        )
    })

    const generateTimeCodeLines = () => {
        let d = duration;
        let timecodeLines = []
        for (let i = 1; d > 0; i++, d -= 60) {
            var durationLeft = duration - ((i - 1) * 60)
            timecodeLines.push(
                <TimecodeLine
                className=""
                videoLength={durationLeft}
                secondToPixelCoef={secToPxCoef}
                minute={i}/>
            );
        }
        return timecodeLines
    }

    const timeCodeLines = generateTimeCodeLines();

    const onTimelineClick = (e) => {
        if (e.detail === 2) {
            var timelineScroll = document.getElementById('timeline-container').scrollLeft
            let result = (e.clientX + timelineScroll) / secToPxCoef
            setNewSecondsFromCursor(result - 0.25)
        }
    }


    return (
        <div className='flex flex-col items-start justify-start w-full overflow-x-hidden'>
            <div className='flex flex-row items-end justify-end mb-2 -mr-12 w-full'>
                <button
                className='bg-myBlue flex items-center justify-center w-8 h-8 rounded-full text-white mr-4'
                onClick={() => setSecToPxCoef(secToPxCoef + 10)}>+</button>
                <button
                disabled={secToPxCoef === MIN_ZOOM ? true: false}
                className={`${secToPxCoef === MIN_ZOOM ? 'bg-gray-500 cursor-not-allowed' : 'bg-myBlue'} flex items- 
                   center justify-center w-8 h-8 rounded-full text-white`}
                onClick={() => setSecToPxCoef(secToPxCoef - 10)}>-</button>
            </div>
            <ContextMenuTrigger id='timeline_menu' holdToDisplay={-1}>
                <div
                id="timeline-container"
                onClick={onTimelineClick}
                className='flex overflow-x-scroll overflow-y-hidden relative
                    w-full m-0 bg-gray-200 border-solid border-t-2 border-l-2 border-r-2 border-gray-300 rounded-b-3xl opacity-50 shadow-lg items-start flex-col'
                    >
                    <div className='flex flex-row items-start'>
                        {replicaLine}
                    </div>
                    <div className='flex flex-row w-full'>
                        {timeCodeLines}
                    </div>
                    <TimelineCursor
                    secondToPixelRatio={secToPxCoef}
                    secondsPlayed={playedSeconds}
                    setNewSecondsFromCursor={setNewSecondsFromCursor}
                    />
                </div>
            </ContextMenuTrigger>


            <ContextMenu id="replica_menu">
                <MenuItem onClick={removeReplica}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>

            <ContextMenu id="timeline_menu" onShow={e => {
                const timeline = document.getElementById('timeline-container')
                const paddingLeft = window.getComputedStyle(document.getElementById('page-container'), null).getPropertyValue('padding-left')
                const scrollX = timeline.scrollLeft;
                const posX = e.detail.position.x;
                const result = (((scrollX + posX) - parseInt(paddingLeft)) / secToPxCoef) * 1000; // -2 rem equals the adjustment of the position
                setNewReplicaTimestamp(result.toFixed(0))
            }}>
                <MenuItem onClick={addReplica}>
                 {/* <MenuItem onClick= _ => await addReplica(newReplicaTimestamp)> */}
                    Ajouter une réplique
                </MenuItem>
            </ContextMenu>
        </div>
    )
}

export default Timeline;