import React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import '../react-contextmenu.css';

const Timeline = ({replicas, onReplicaSelection}) => {
    console.log(JSON.stringify(replicas));
    const replicaLine = replicas.map((replica, index) => {
        return (
            <ContextMenuTrigger id='replica-ctm'>
                <button className='h-fit w-fit bg-green-700 p-4 rounded focus:outline-none focus:border focus:border-blue-600' key={index}
                    onClick={() => onReplicaSelection(replica._id)}>
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

            <ContextMenu id='replica-ctm'>
                <MenuItem onClick={() => console.log("handle deletion of clicked replica...")}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>
        </>
    )
}

export default Timeline;