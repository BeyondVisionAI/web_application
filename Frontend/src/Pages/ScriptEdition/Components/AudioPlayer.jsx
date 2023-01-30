import { useState, useEffect, useCallback } from "react";

const AudioPlayer = ({replicas, playedSeconds, newSecondsFromCursor, resetNewSecondsFromCursor, triggerPause}) => {
    const [sortedReplicas, setSortedReplicas] = useState([])
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [replicasAudio, setReplicasAudio] = useState([]);
    const [nextReplicaId, setNextReplicaId] = useState(null);
    const [nextReplicaEndTimestamp, setNextReplicaEndTimestamp] = useState(null);

    const loadAudio = useCallback(
      (replicaId, isNext = false) => {
        const idx = replicas.findIndex(i => i._id === replicaId);
        const replica = replicas[idx];
        if (replica?.audioUrl) {
            const replicaAudioObj = {
                id: replicaId,
                audio: new Audio(replica.audioUrl),
                replica: replica
            }
            setReplicasAudio([...replicasAudio, replicaAudioObj]);
            if (isNext) {
                setNextReplicaId(replicaId)
            }
        }
      },
      [replicas],
    )

    useEffect(() => {
        console.log("🚀 ~ file: AudioPlayer.jsx:31 ~ useEffect ~ isAudioPlaying", isAudioPlaying)
        if (isAudioPlaying) {
            setIsAudioPlaying(false);
            const idx = replicasAudio.findIndex(i => i.id === nextReplicaId)
            if (idx !== -1) {
                replicasAudio[idx]?.audio?.pause();
            }
        }
    }, [triggerPause]);

    const updateAudio = useCallback(
        (replicaId) => {
            const idx = replicasAudio.findIndex(i => i.id === replicaId);
            if (idx !== -1) {
                const cpyAudio = [...replicasAudio];
                const idxReplica = replicas.findIndex(i => i._id === replicaId);
                const replica = replicas[idxReplica];
                if (replica.audioUrl !== cpyAudio[idx].replica.audioUrl) {
                    cpyAudio[idx].audio = new Audio(replica.audioUrl);
                    cpyAudio[idx].replica = replica;
                    setReplicasAudio(cpyAudio);
                }
            }
        },
        [replicasAudio, replicas]
    )

    const returnClosestId = useCallback(
        (currentTime) => {
            if (sortedReplicas.length === 0) return;
            const closest = sortedReplicas.reduce(function(prev, curr) {
                return (Math.abs(curr.timestamp - currentTime) < Math.abs(prev.timestamp - currentTime) ? curr : prev);
            });
            let closestIdx = sortedReplicas.findIndex(val => val === closest)
            if (closest.timestamp + closest.duration < currentTime) {
                if (closestIdx + 1 < sortedReplicas.length) {
                    closestIdx += 1;
                } else {
                    closestIdx = 0;
                }
            }
            return (sortedReplicas[closestIdx]._id)
        },
        [sortedReplicas]
    )

    useEffect(() => {
        if (!newSecondsFromCursor) return;
        const currentTime = newSecondsFromCursor * 1000;
        const closestId = returnClosestId(currentTime);
        if (replicasAudio.filter(i => i.id === closestId).length === 0) {
            loadAudio(closestId, true)
        } else {
            setNextReplicaId(closestId)
        }
        resetNewSecondsFromCursor()
    }, [newSecondsFromCursor]);

    useEffect(() => {
        const idx = replicasAudio.findIndex(i => i.id === nextReplicaId);
        if (idx !== -1) {
            const replica = replicasAudio[idx];
            const currentTime = playedSeconds * 1000;
            if (currentTime >= replica.replica.timestamp && !isAudioPlaying && currentTime <= nextReplicaEndTimestamp) {
                replica.audio.play()
                setIsAudioPlaying(true);
            } else {
                if (currentTime > nextReplicaEndTimestamp && !newSecondsFromCursor) {
                    setNextReplicaId(returnClosestId(currentTime))
                }
                if (currentTime > nextReplicaEndTimestamp && isAudioPlaying) {
                    setIsAudioPlaying(false)
                }
            }
        } else {
            loadAudio(nextReplicaId)
        }
    }, [playedSeconds]);

    useEffect(() => {
        const idx = replicas.findIndex(i => i._id === nextReplicaId)
        if (idx !== -1) {
            setNextReplicaEndTimestamp(replicas[idx].timestamp + replicas[idx].duration)
        }
    }, [nextReplicaId]);

    useEffect(() => {
        let sorted = replicas.sort((a, b) => a.timestamp - b.timestamp)
        setSortedReplicas(sorted)
        replicas.forEach(replica => {
            if (replicasAudio.filter(i => i.id === replica._id).length === 0) {
                loadAudio(replica._id)
            } else {
                updateAudio(replica._id)
            }
        })
        const currentTime = newSecondsFromCursor * 1000;
        const closestId = returnClosestId(currentTime);
        if (closestId) {
            setNextReplicaId(closestId)
        } else {
            setNextReplicaId(replicas[0]?._id)
        }
    }, [replicas]);

    return (
        <div />
     );
}

export default AudioPlayer;