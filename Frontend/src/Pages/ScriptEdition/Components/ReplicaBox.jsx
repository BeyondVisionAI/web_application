import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import { ContextMenuTrigger } from 'react-contextmenu';

export default function ReplicaBox({ replica, index, parameters, onReplicaSelection, setSelectedRepId }) {
    console.log("🚀 ~ file: ReplicaBox.jsx ~ line 6 ~ ReplicaBox ~ parameters", parameters)
    console.log("🚀 ~ file: ReplicaBox.jsx ~ line 6 ~ ReplicaBox ~ replica", replica)
    const [playing, setPlaying] = useState(false);

    console.log(parameters)

    useEffect(() => {
        if (!playing) // and curseur is on the box
            setPlaying(true);
        else
            setPlaying(false);
    }, [parameters.timestamp])

    return (
        <ContextMenuTrigger id="replica_menu" key={index}>
            <button className='bg-blue-700 py-4 rounded focus:outline-none focus:border hover:border-green-400 focus:border-orange-400 text-white
                    absolute' style={{left: `${parameters.secToPxCoef * replica.timestamp / 1000}px`, width: `${parameters.secToPxCoef * replica.duration / 1000}px`}}
                        onClick={() => onReplicaSelection(replica._id)}
                        onContextMenu={() => {onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                        {/* should be adjustable to the size of the replica (so its length) */}
                        <p>{replica.content.length > 30 ?
                            replica.content.slice(0, 26) + " ..."
                        :   replica.content}</p>
            </button>
            <ReactPlayer url='https://d1meq9j1gywa1t.cloudfront.net/Project-Test/001.mp3' playing={ playing } />
        </ContextMenuTrigger>
  )
}
// TODO:
// Integration du composant
// Recuperation du curseur, run l'audio avec le player de la vidéo et la position du curseur
// Scale la box
