import { React, useEffect, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';


import TimecodeLine from './TimecodeLine';
import ReplicaBox from './ReplicaBox';

// temporary duration of a project, so we can do the timeline
// const videoLength = 3600000 / 4;
const canvasHeight = 80;
// coefficient between seconds (in ms) and pixels : 1 sec =
// var secToPxCoef = 300; // will change if zoom

const Timeline = ({player, duration, replicas, projectId, onReplicaSelection, updateReplica, removeReplicaFromState}) => {
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);
    const [secToPxCoef, setSecToPxCoef] = useState(100);
    const [replicasPositions, setReplicasPositions] = useState([]);
    // const [newReplicaTimestamp, setNewReplicaTimestamp] = useState(-1); // smh not sure how its updated, soooo
    var newReplicaTimestamp = -1;
    var timecodeArray = [];
    const [currentTime, setCurrentTime] = useState(0);


    const addReplica = async function () {
        if (newReplicaTimestamp == -1) return;
        else if (newReplicaTimestamp >= duration - 1500) {
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
        console.log("🚀 ~ file: Timeline.jsx ~ line 144 ~ useEffect ~ SecToPx", SecToPx)
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
        return (
            <ReplicaBox
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


    if (!player)
        return (<h1>Loading</h1>)
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row items-end justify-end mb-2'>
                <button className='bg-myBlue flex items-center justify-center w-8 h-8 rounded-full text-white mr-4' onClick={() => setSecToPxCoef(secToPxCoef + 100)}>+</button>
                <button disabled={secToPxCoef === 100 ? true: false} className='bg-myBlue flex items-center justify-center w-8 h-8 rounded-full text-white mr-4' onClick={() => setSecToPxCoef(secToPxCoef - 100)}>-</button>
            </div>
            <ContextMenuTrigger id='timeline_menu' holdToDisplay={-1}>
                <div className='flex overflow-x-scroll overflow-y-hidden relative
                w-screen bg-gray-500 rounded-b-3xl opacity-50 shadow-lg items-start flex-col'>
                    <div className='flex flex-row items-start'>
                        {replicaLine}
                    </div>
                    <TimecodeLine className="" videoLength={duration} secondToPixelCoef={secToPxCoef} minute={1}/>
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
                var result = ((scrollX + posX - (16 * 2)) / secToPxCoef); // -2 rem equals the adjustment of the position
                newReplicaTimestamp = (result * 1000).toFixed(0);
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