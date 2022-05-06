import { React, useEffect, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';

// temporary duration of a project, so we can do the timeline
const videoLength = 3600000 / 4;

const Timeline = ({replicas, projectId, onReplicaSelection, updateReplicaList}) => {
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);

    // coefficient between seconds (in ms) and pixels : 1 sec = 
    var secToPxCoef = 150000; // will change if zoom


    const removeReplica = async function () {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas/${contextSelectedReplicaId}`,
                withCredentials: true
            });
            onReplicaSelection(null);
            await updateReplicaList();
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
                    <p>{replica.content}</p>
                </button>
            </ContextMenuTrigger>
        )
    })

    const drawTimecodeLine = function() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        
        const spacing = secToPxCoef / 10; // should I count the pixels necessary to draw lines?

        ctx.lineWidth = 0.1;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        // ctx.moveTo(10, 10);
        // ctx.lineTo(100, 10);
        // ctx.stroke();

        for (var interval = 0; interval < 10; interval++) {
            ctx.moveTo(interval * spacing + 0.5, 50);
            ctx.lineTo(interval * spacing + 0.5, 10);
            ctx.stroke();
        }
        
        // ctx.moveTo(100, 0);
        // ctx.lineTo(100, 120);
        // ctx.stroke();

        // ctx.moveTo(200, 0);
        // ctx.lineTo(200, 220);
        // ctx.stroke();
    }

    useEffect(() => {
        drawTimecodeLine();
    }, []);

    return (
        <>
            <div className='flex overflow-x-auto relative
            w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg'
            style={{width: `${secToPxCoef * videoLength}px`}}>
                {replicaLine}
                {/* Peut-être pas nécessaire, car on va créer une timeline qui permettra l'ajout dynamique */}
                <div className='p-1 absolute'
                style={{left: `${secToPxCoef * videoLength / 1000000 - 1}px`, width: `${secToPxCoef / 1000000}px`}} />
                <canvas id='canvas' className='h-1/5 bg-black place-self-end w-full'
                    style={{width: `${secToPxCoef * videoLength}px`}}>
                </canvas>
            </div>


            <ContextMenu id="replica_menu">
                <MenuItem onClick={removeReplica}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>
        </>
    )
}

export default Timeline;