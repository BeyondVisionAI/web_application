import { React, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../react-contextmenu.css';
import { axios } from 'axios';

const Timeline = ({replicas, projectId, onReplicaSelection, updateReplicaList}) => {
    const [contextSelectedReplicaId, setSelectedRepId] = useState(null);
    const [loadedProject, setLoadedProject] = useState(projectId)

    const removeReplica = async function () {
        // console.warn(`removing replica ${contextSelectedReplicaId}`);
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/projects/${projectId}/replicas/${contextSelectedReplicaId}`,
                withCredentials: true
            });
            updateReplicaList();
        } catch (e) {
            console.error("err", e);
        }
    }

    const replicaLine = replicas.map((replica, index) => {
        return (
            <ContextMenuTrigger id="replica_menu" key={index}>
                <button className='h-fit w-fit bg-green-700 p-4 rounded focus:outline-none focus:border focus:border-blue-600'
                    onClick={() => onReplicaSelection(replica._id)} 
                    onContextMenu={() => {onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                    <p>{replica.content}</p>
                </button>
            </ContextMenuTrigger>
        )
    })

    return (
        <>
            <div className='flex flex-row justify-between items-center
            w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg'>
                {replicaLine}
            </div>


            <ContextMenu id="replica_menu">
                <MenuItem onClick={removeReplica} data={{replicaId: {contextSelectedReplicaId}}}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>
        </>
    )
}

export default Timeline;