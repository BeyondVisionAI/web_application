import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import { ContextMenuTrigger } from 'react-contextmenu';
import Draggable from "react-draggable";
import axios from "axios";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BounceLoader, ClipLoader } from 'react-spinners';

export default function ReplicaBox({ replica, index, parameters, onReplicaSelection, setSelectedRepId, updateReplica, videoDuration, replicasPositions }) {
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.scriptEdition.replica'});
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
    }, [parameters.secToPxCoef, replica.timestamp]);

    const isReplicaCollided = function(replicasPositions, startTimestamp, endTimestamp) {
        for (var otherReplica of replicasPositions) {
            if (replica._id === otherReplica.id)
                continue;

            if (otherReplica.end > endTimestamp) { // trying to position the replica on the left-side of the other replica : 2 cases
                if (endTimestamp > otherReplica.start) { // meaning the end of replica will be between oR.start and oR.end === OVERLAP
                    return true;
                } // else no overlap, it is correctly positioned on the left side of the other replica
            }
            if (otherReplica.start < startTimestamp) {// trying to position the replica on the right-side of the other replica : 2 cases
                if (startTimestamp < otherReplica.end) { //meaning the start of replica will be between oR.end and oR.start === OVERLAP
                    return true;
                } // else no overlap, it is correctly positioned on the left side of the other replica
            }
            if (startTimestamp <= otherReplica.start && endTimestamp >= otherReplica.end) // Last case : if the replica covers a shorter other replica
                return true;
        }
        return false;
    }

    const computeDragDrop = async (event, data) => {
        let dropOffMSecond = parseInt(((data.x / parameters.secToPxCoef) * 1000).toFixed());
        if (isReplicaCollided(replicasPositions, dropOffMSecond, dropOffMSecond + parseInt(replica.duration))) {
            toast.error(tErr("noOverlap"));
            return false;
        }
        let newPos = {...position}
        newPos.x = data.x
        setPosition(newPos)
        var newReplica = {...replica}
        // let dropOffMSecond = (data.x / parameters.secToPxCoef) * 1000;
        // dropOffMSecond = parseInt(dropOffMSecond.toFixed())
        newReplica.timestamp = dropOffMSecond;
        if (newReplica.timestamp !== replica.timestamp) {
            try {
                await axios({
                    method: 'PUT',
                    url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}`,
                    data: {timestamp: dropOffMSecond},
                    withCredentials: true
                });
                updateReplica(newReplica)                    
            } catch (_) {
                toast.error(tErr("moveReplica"));
            }
        }
    }

    return (
        <ContextMenuTrigger id="replica_menu" key={index} holdToDisplay={-1}>
            <Draggable
            axis='x'
            position={position}
            onStop={computeDragDrop}
            // grid={[parameters.secToPxCoef / 10, 0]}
            bounds={{left: 0, right: parameters.secToPxCoef * (videoDuration - (replica.duration / 1000))}}
            >
                <button className='bg-blue-700 py-4 rounded focus:outline-none focus:border hover:border-green-400 focus:border-orange-400 text-white flex items-center justify-center
                        absolute' style={{width: `${parameters.secToPxCoef * replica.duration / 1000}px`}}
                            onClick={() => onReplicaSelection(replica._id)}
                            onContextMenu={() => {onReplicaSelection(replica._id); setSelectedRepId(replica._id)}}>
                            {/* should be adjustable to the size of the replica (so its length) */}
                            <p className={'truncate px-4'}>{replica.content}</p>
                            {replica.status !== 'Done' && <ClipLoader color='#F6F8FF' size={20}/>}
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
