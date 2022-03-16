import React from 'react';

const Timeline = ({replicas, onReplicaSelection}) => {
    console.log(JSON.stringify(replicas));
    const replicaLine = replicas.map((replica, index) => {
        return (
            <button className='h-fit w-fit bg-green-700 p-4 rounded focus:outline-none focus:border focus:border-blue-600' key={index}
                onClick={() => onReplicaSelection(replica._id)}>
                <p>{replica.content}</p>
            </button>
        )
    })

    return (
        <div className='flex flex-row justify-between items-center
        w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg'>
            {replicaLine}
        </div>
    )
}

export default Timeline;