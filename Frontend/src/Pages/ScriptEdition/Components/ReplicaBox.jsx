import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import { ContextMenuTrigger } from 'react-contextmenu';
import Draggable from "react-draggable";
import axios from "axios"

export default function ReplicaBox({ replica, index, parameters, onReplicaSelection, setSelectedRepId, updateReplica, videoDuration }) {
    const [playing, setPlaying] = useState(false);
    const [position, setPosition] = useState({x: parameters.secToPxCoef * replica.timestamp / 1000, y: 0})

    useEffect(() => {
        if (!playing) // and curseur is on the box
            setPlaying(true);
        else
            setPlaying(false);
    }, [parameters.timestamp])

    useEffect(() => {
        setPosition({x: parameters.secToPxCoef * replica.timestamp / 1000, y: 0})
    }, [parameters.secToPxCoef]);

    const computeDragDrop = async (event, data) => {
        let newPos = {...position}
        newPos.x = data.x
        setPosition(newPos)
        var newReplica = {...replica}
        let dropOffMSecond = (data.x / parameters.secToPxCoef) * 1000;
        dropOffMSecond = dropOffMSecond.toFixed()
        newReplica.timestamp = dropOffMSecond
        await axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}`,
            data: {timestamp: dropOffMSecond},
            withCredentials: true
        });
        updateReplica(newReplica)
    }

    return (
        <ContextMenuTrigger id="replica_menu" key={index}>
            <Draggable
            axis='x'
            position={position}
            onStop={computeDragDrop}
            bounds={{left: 0, right: parameters.secToPxCoef * (videoDuration - (replica.duration / 1000))}}
            >
                <button className='bg-blue-700 py-4 rounded focus:outline-none focus:border hover:border-green-400 focus:border-orange-400 text-white
                        absolute' style={{width: `${parameters.secToPxCoef * replica.duration / 1000}px`}}
                            onClick={() => onReplicaSelection(replica._id)}
                            onContextMenu={() => {onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                            {/* should be adjustable to the size of the replica (so its length) */}
                            <p className='truncate px-4'>{replica.content}</p>
                </button>
            </Draggable>
            {/* <ReactPlayer url='https://d1meq9j1gywa1t.cloudfront.net/Project-Test/001.mp3' playing={ playing } /> */}
        </ContextMenuTrigger>
  )
}
// TODO:
// Integration du composant
// Recuperation du curseur, run l'audio avec le player de la vidéo et la position du curseur
// Scale la box
