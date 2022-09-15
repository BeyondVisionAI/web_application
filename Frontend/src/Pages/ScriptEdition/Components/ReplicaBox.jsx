import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import { ContextMenuTrigger } from 'react-contextmenu';
import Draggable from 'react-draggable';

export default function ReplicaBox({ replica, index, parameters, onReplicaSelection, setSelectedRepId, onStopReplicaDrag }) {
    console.log("🚀 ~ file: ReplicaBox.jsx ~ line 6 ~ ReplicaBox ~ parameters", parameters)
    console.log("🚀 ~ file: ReplicaBox.jsx ~ line 6 ~ ReplicaBox ~ replica", replica)
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!playing) // and curseur is on the box
            setPlaying(true);
        else
            setPlaying(false);
    }, [parameters.timestamp])

    return (
        <Draggable axis='x' key={index} bounds={{
                left: -parameters.secToPxCoef * replica.timestamp / 1000000, top: 0,
                right: (parameters.secToPxCoef * parameters.videoLength - 1500) / 1000000, bottom: 0}}
                position={{x: 0, y: 0}} onStop={() => onStopReplicaDrag(replica._id)}>
            <div>
                <ContextMenuTrigger id="replica_menu" key={index} holdToDisplay={-1}>
                    <button
                     id={replica._id}
                     className='bg-blue-700 py-4 rounded focus:outline-none focus:border hover:border-green-400 focus:border-orange-400 text-white absolute'
                     style={{left: `${parameters.secToPxCoef * replica.timestamp / 1000000}px`,
                     width: `${parameters.secToPxCoef * replica.duration / 1000000}px`}}
                     onClick={() => onReplicaSelection(replica._id)}
                     onContextMenu={(e) => {e.preventDefault(); onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                                <p>{replica.content.length > 30 ?
                                        replica.content.slice(0, 26) + " ..." :
                                        replica.content}
                                </p>
                    </button>
                    <ReactPlayer url='https://d1meq9j1gywa1t.cloudfront.net/Project-Test/001.mp3' playing={ playing } />
                </ContextMenuTrigger>
            </div>
        </Draggable>
  )
}
// TODO:
// Integration du composant
// Recuperation du curseur, run l'audio avec le player de la vidéo et la position du curseur
// Scale la box
