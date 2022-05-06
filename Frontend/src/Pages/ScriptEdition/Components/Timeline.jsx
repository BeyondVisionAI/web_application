import { React, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';


const Timeline = ({replicas, projectId, onReplicaSelection, updateReplicaList}) => {
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);

    // coefficient between seconds and pixels : 1 second = 20 px
    var secToPxCoef = 20; // will change if zoom


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
                <button className='h-fit w-fit bg-green-700 p-4 rounded focus:outline-none focus:border focus:border-blue-600
                absolute' style={{left: `${secToPxCoef * replica.timestamp}px`}}//{secToPxCoef * {replica.timestamp}}}}
                    onClick={() => onReplicaSelection(replica._id)} 
                    onContextMenu={() => {onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                    <p>{replica.content}</p>
                </button>
            </ContextMenuTrigger>
        )
    })


    return (
        <>
            <div className='flex flex-row items-center overflow-x-auto relative
            w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg'>
                {replicaLine}
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