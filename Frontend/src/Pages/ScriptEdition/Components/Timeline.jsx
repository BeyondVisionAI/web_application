import { React, useEffect, useRef, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
import TimecodeBlock from './TimecodeBlock';

// temporary duration of a project, so we can do the timeline
const videoLength = 3600000 / 4; // 3600000 / 4; // 15 min
const canvasHeight = 80;
// coefficient between seconds (in ms) and pixels : 1 sec =
var secToPxCoef = 150000; // will change if zoom

const Timeline = ({replicas, projectId, onReplicaSelection, updateReplicaList, toggleReplicaSelected}) => {
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);
    // const [newReplicaTimestamp, setNewReplicaTimestamp] = useState(-1); // smh not sure how its updated, soooo
    var newReplicaTimestamp = -1;



    const addReplica = async function () {
        if (newReplicaTimestamp == -1) return;
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

            await updateReplicaList(projectId);
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
    }


    const removeReplica = async function () {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas/${contextSelectedReplicaId}`,
                withCredentials: true
            });
            onReplicaSelection(null);
            await updateReplicaList(projectId);
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


    const TimecodeBlockCreator = function () {
        const nbTCL = videoLength / 60000; // divide it by number of minutes
        var timecodeArray = [];
        for (var i = 0; i < nbTCL; i++) {
            timecodeArray.push(<TimecodeBlock videoLength={videoLength} secondToPixelCoef={secToPxCoef}
                minute={i+1} key={i}/>);
        }
        return timecodeArray;
    }


    const onStopReplicaDrag = async function (replicaID) {
        try {
            // timeline elem variables
            var timelineE = document.getElementById("timeline-scrollable");
            var horizontalScroll = timelineE.scrollLeft;
            var timelineLeftPadding = timelineE.getBoundingClientRect().left;
            // replica square variables
            var replicaRect = document.getElementById(replicaID).getBoundingClientRect();
            var result = (((horizontalScroll + replicaRect.left - timelineLeftPadding) / secToPxCoef * 1000)).toFixed(3);
            console.log(`New timestamp at ${result}s`);
            var newTimestamp = result * 1000;

            await axios({
                method: 'PUT',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas/${replicaID}`,
                data: {timestamp: newTimestamp},
                withCredentials: true
            });
            // await updateReplicaList(projectId);
        } catch (err) { // TODO check
            let errLog;
            // console.error("error : ", err);

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
            // <Draggable> {/* bounds="parent" */} {/*  bounds={{left:-100, right: 100, top: 0, bottom: 0}} */}
                // <div>
                <Draggable axis='x' key={index} bounds={{
                    left: -secToPxCoef * replica.timestamp / 1000000, top: 0,
                    right: (secToPxCoef * videoLength - 1500) / 1000000, bottom: 0
                }} onStop={() => onStopReplicaDrag(replica._id)}>
                    <div>
                    <ContextMenuTrigger id="replica_menu" key={index} holdToDisplay={-1}>
                        <button id={replica._id} className='bg-blue-700 py-4 rounded focus:outline-none focus:border hover:border-green-400 focus:border-orange-400 text-white
                        absolute' style={{left: `${secToPxCoef * replica.timestamp / 1000000}px`, width: `${secToPxCoef * replica.duration / 1000000}px`}}
                            onClick={() => onReplicaSelection(replica._id)}
                            onContextMenu={(e) => {e.preventDefault(); onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                            {/* should be adjustable to the size of the replica (so its length) */}
                            <p>{replica.content.length > 30 ?
                                replica.content.slice(0, 26) + " ..."
                            :   replica.content}</p>
                        </button>
                    </ContextMenuTrigger>
                    </div>
                </Draggable>
                // </div>
            // </Draggable>
        )
    })


    return (
        <>
            <ContextMenuTrigger id='timeline_menu' holdToDisplay={-1}>
                <div id="timeline-scrollable" className='flex overflow-x-scroll relative
                w-screen h-full bg-gray-500 rounded-b-3xl opacity-50 shadow-lg'
                onContextMenu={(e) => e.preventDefault()}>
                    {replicaLine}
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
                var element = document.getElementById("timeline-scrollable")
                var scrollX = element.scrollLeft;
                var posX = e.detail.position.x;
                console.log(">>> " + e.detail.position.x);
                var result = ((scrollX + posX - (16 * 2)) / secToPxCoef * 1000); // -2 rem equals the adjustment of the position
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