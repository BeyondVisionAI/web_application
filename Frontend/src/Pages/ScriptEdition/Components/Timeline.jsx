import { React, useEffect, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';

import ReplicaBox from './ReplicaBox';
import TimecodeBlock from './TimecodeBlock';

// coefficient between seconds (in ms) and pixels : 1 sec =
let secToPxCoef = 300; // will change if zoom
let canvasHeight = 80;

const Timeline = ({player, duration, replicas, projectId, onReplicaSelection, toggleReplicaSelected, addNewReplica, removeReplicaFromState, updateReplicaTimestamp}) => {
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);
    // const [newReplicaTimestamp, setNewReplicaTimestamp] = useState(-1); // smh not sure how its updated, soooo
    let newReplicaTimestamp = -1;
    let timecodeArray = [];
    const [currentTime, setCurrentTime] = useState(0);

    const addReplica = async function () {
        if (newReplicaTimestamp === -1) return;
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

            addNewReplica(res.data);
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
                    break;
                default/*500*/: errLog = `Error (${err.response.status}) - Internal Error.`; break;
            }

            toast.error(errLog);
        }
    }


    const removeReplica = async function () {
        try {
            await axios({
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
                    break;
                default/*500*/: errLog = `Error (${err.response.status}) - Internal Error.`; break;
            }

            toast.error(errLog);
        }
    }

    // useEffect(() => {
    //     setVideoLength((player.current.getDuration() / 1000) / 4) // GetDuration doesn't give right value
    //     setCurrentTime(player.current.getCurrentTime())
    //     console.log(player.current.getDuration())
    // }, [player.current]);

    useEffect(() => {
        const nbSeconds = duration;
        console.log("🚀 ~ file: Timeline.jsx ~ line 148 ~ useEffect ~ nbSeconds", nbSeconds)

        for (let i = 0; i < nbSeconds; i++) {
            timecodeArray.push({
                videoLength: duration,
                secondToPixelCoef: secToPxCoef,
                minute: i,
                zoom: 1
            });
        }
    }, [duration])


    const TimecodeBlockCreator = function () {
        const nbTCL = duration / 60000; // divide it by number of minutes
        let timecodeArray = [];
        for (let i = 0; i < nbTCL; i++) {
            timecodeArray.push(<TimecodeBlock videoLength={duration} secondToPixelCoef={secToPxCoef}
                minute={i+1} key={i}/>);
        }
        return timecodeArray;
    }


    const onStopReplicaDrag = async function (replicaID) {
        try {
            // timeline elem letiables
            let timelineE = document.getElementById("timeline-scrollable");
            let horizontalScroll = timelineE.scrollLeft;
            let timelineLeftPadding = timelineE.getBoundingClientRect().left;
            // replica square letiables
            let replicaRect = document.getElementById(replicaID).getBoundingClientRect();
            let result = (((horizontalScroll + replicaRect.left - timelineLeftPadding) / secToPxCoef * 1000)).toFixed(3);
            console.log(`New timestamp at ${result}s`);
            let newTimestamp = result * 1000;

            await axios({
                method: 'PUT',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas/${replicaID}`,
                data: {timestamp: newTimestamp},
                withCredentials: true
            });
            updateReplicaTimestamp(replicaID, newTimestamp);
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
        }
        toggleReplicaSelected();
    }

    const replicaLine = replicas.map((replica, index) => {
        return (
            <ReplicaBox
                replica={replica}
                index={index}
                parameters={{secToPxCoef: secToPxCoef, videoLength: duration, timestamp: currentTime}}
                onReplicaSelection={onReplicaSelection}
                setSelectedRepId={setSelectedRepId}
                onStopReplicaDrag={onStopReplicaDrag}
            />
        )
    })


    if (!player)
        return (<h1>Loading</h1>)
    return (
        <>
            <ContextMenuTrigger id='timeline_menu' holdToDisplay={-1} >
                <div id='timeline-scrollable' className='flex overflow-x-scroll relative
                w-screen bg-gray-500 rounded-b-3xl h-full opacity-50 shadow-lg '> {/* overflow-y-hidden items-start flex-col */}
                    onContextMenu={(e) => e.preventDefault()}
                    {replicaLine}
                    {/* <TimecodeBlock className="" videoLength={duration} secondToPixelCoef={secToPxCoef} minute={1}/> */}
                    <div className='p-0 place-self-end flex flex-row justify-between'
                    style={{width: `${secToPxCoef / 1000000}px`, height: `${canvasHeight}px`}}>
                        {TimecodeBlockCreator()}
                    </div>
                </div>
            </ContextMenuTrigger>


            <ContextMenu id="replica_menu">
                <MenuItem onClick={removeReplica}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>

            <ContextMenu id="timeline_menu" onShow={e => {
                let element = document.getElementById("timeline-scrollable")
                let scrollX = element.scrollLeft;
                let posX = e.detail.position.x;
                console.log(">>> " + e.detail.position.x);
                let result = ((scrollX + posX - (16 * 2)) / secToPxCoef * 1000); // -2 rem equals the adjustment of the position
                console.log(`Result is then ${result}s`);

                newReplicaTimestamp = (result * 1000).toFixed(0);
            }}>
                <MenuItem onClick={addReplica}>
                    Ajouter une réplique
                </MenuItem>
            </ContextMenu>
        </>
    )
}

export default Timeline;