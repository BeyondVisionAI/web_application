import { React, useEffect, useRef, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';

// temporary duration of a project, so we can do the timeline
const videoLength = 3600000 / 4;
const canvasHeight = 80;
// coefficient between seconds (in ms) and pixels : 1 sec = 
var secToPxCoef = 150000; // will change if zoom

const Timeline = ({replicas, projectId, onReplicaSelection, updateReplicaList}) => {
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


    const replicaLine = replicas.map((replica, index) => {
        return (
            <ContextMenuTrigger id="replica_menu" key={index}>
                <button className='bg-green-700 py-4 rounded focus:outline-none focus:border focus:border-blue-600
                absolute' style={{left: `${secToPxCoef * replica.timestamp / 1000000}px`, width: `${secToPxCoef * replica.duration / 1000000}px`}}
                    onClick={() => onReplicaSelection(replica._id)} 
                    onContextMenu={() => {onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                    {/* should be adjustable to the size of the replica (so its length) */}
                    <p>{replica.content.length > 30 ?
                        replica.content.slice(0, 26) + " ..."
                    :   replica.content}</p>
                </button>
            </ContextMenuTrigger>
        )
    })


    const drawLine = function(ctx, xCoordinate, heightCoef) {
        ctx.moveTo(xCoordinate, canvasHeight);
        ctx.lineTo(xCoordinate, canvasHeight - canvasHeight * heightCoef);
        ctx.stroke();
    }

    const drawTimecodeLine = function() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        
        const spacing = secToPxCoef / 1000;

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFF';
        ctx.beginPath();

        for (var minute = 0; minute < 10; minute++) {
            drawLine(ctx, spacing * minute * 60, 0.8);
            for (var second = 0; second < 60; second++) {
                drawLine(ctx, spacing * minute + spacing * second, 0.5);
                // ms
                drawLine(ctx, spacing * minute + spacing * second + spacing * 1 / 4, 0.2);
                drawLine(ctx, spacing * minute + spacing * second + spacing * 2 / 4, 0.2);
                drawLine(ctx, spacing * minute + spacing * second + spacing * 3 / 4, 0.2);
            }
        }
        // for (var interval = 0; interval < 10; interval++) {
        //     drawLine(ctx, spacing * interval, 0.5);
        //     // ms
        //     drawLine(ctx, spacing * interval + spacing * 1 / 4, 0.2);
        //     drawLine(ctx, spacing * interval + spacing * 2 / 4, 0.2);
        //     drawLine(ctx, spacing * interval + spacing * 3 / 4, 0.2);

        // }
    }

    useEffect(() => {
        drawTimecodeLine();
    }, []);

    return (
        <>
            <ContextMenuTrigger id='timeline_menu' >
                <div className='flex overflow-x-auto relative
                w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg'
                style={{width: `${secToPxCoef * videoLength}px`}}>
                    {replicaLine}
                    {/* Peut-être pas nécessaire, car on va créer une timeline qui permettra l'ajout dynamique */}
                    <div className='p-1 absolute'
                    style={{left: `${secToPxCoef * videoLength / 1000000 - 1}px`, width: `${secToPxCoef / 1000000}px`}} />

                    <canvas id='canvas' className='bg-black place-self-end'
                    style={{width: `${secToPxCoef * videoLength / 10000000}px`, height: `${canvasHeight}px`}}
                        height={canvasHeight}  width={secToPxCoef * videoLength / 10000000} >
                    </canvas>
                </div>
            </ContextMenuTrigger>


            <ContextMenu id="replica_menu">
                <MenuItem onClick={removeReplica}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>

            <ContextMenu id="timeline_menu" onShow={e => {
                var scrollX = e.target.scrollX;
                var posX = e.detail.position.x;
                var result = ((scrollX + posX - (16 * 2)) / secToPxCoef * 1000); // -2 rem equals the adjustment of the position
                console.log(`Result is then ${result}s`);

                newReplicaTimestamp = (result * 1000).toFixed(0);
            }}>
                <MenuItem onClick={addReplica}>
                 {/* <MenuItem onClick= _ => await addReplica(newReplicaTimestamp)> */}
                    Ajouter une réplique
                </MenuItem>
            </ContextMenu>
        </>
    )
}

export default Timeline;