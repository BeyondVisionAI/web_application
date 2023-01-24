import { useState, useEffect } from "react";

const AudioPlayer = ({replicas, playedSeconds, newSecondsFromCursor, resetNewSecondsFromCursor, triggerPause}) => {
    const [sortedReplicas, setSortedReplicas] = useState([])
    const [currentReplicaAudio, setCurrentReplicaAudio] = useState(null);
    const [currentReplica, setCurrentReplica] = useState(null);
    const [nextReplicaAudio, setNextReplicaAudio] = useState(null);
    const [nextReplicaIndex, setNextReplicaIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (isPlaying) {
            setTimeout(loadNextAudio, currentReplica?.duration)
        }
    }, [isPlaying]);

    useEffect(() => {
<<<<<<< Updated upstream
        if (isPlaying) {
            currentReplicaAudio?.pause()
            setIsPlaying(false)
        }
    }, [triggerPause]);

=======
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
                if (replicaId === nextReplicaId) {
                    setNextReplicaEndTimestamp(replica.timestamp + replica.duration)
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

>>>>>>> Stashed changes
    useEffect(() => {
        if (!newSecondsFromCursor) return;
        if (sortedReplicas.length === 0) return;
        var closest = sortedReplicas.reduce(function(prev, curr) {
            return (Math.abs(curr.timestamp - newSecondsFromCursor * 1000) < Math.abs(prev.timestamp - newSecondsFromCursor * 1000) ? curr : prev);
        });
        var closestIdx = sortedReplicas.findIndex(val => val === closest)
        if (closest.timestamp + closest.duration < newSecondsFromCursor * 1000) {
            closestIdx += 1;
        }
        loadNextAudio(closestIdx)
        resetNewSecondsFromCursor()
    }, [newSecondsFromCursor]);

    useEffect(() => {
<<<<<<< Updated upstream
        loadNextAudio()
    }, [sortedReplicas]);
=======
        const idx = replicasAudio.findIndex(i => i.id === nextReplicaId);
        if (idx !== -1) {
            const currentTime = playedSeconds * 1000;
            const replica = replicasAudio[idx];
            if (currentTime >= replica.replica.timestamp && !isAudioPlaying && currentTime <= nextReplicaEndTimestamp) {
                replica.audio.play()
                setIsAudioPlaying(true);
            } else {
                if (currentTime > nextReplicaEndTimestamp && !newSecondsFromCursor) {
                    setNextReplicaId(returnClosestId(currentTime))
                }
                if (currentTime > nextReplicaEndTimestamp &&    isAudioPlaying) {
                    setIsAudioPlaying(false)
                }
            }
        } else {
            loadAudio(nextReplicaId)
        }
    }, [playedSeconds]);
>>>>>>> Stashed changes

    useEffect(() => {
        if (playedSeconds * 1000 >= currentReplica?.timestamp && !isPlaying) {
            currentReplicaAudio?.play()
            setIsPlaying(true)
        }
    }, [playedSeconds]);

    useEffect(() => {
        let sorted = replicas.sort((a, b) => a.timestamp - b.timestamp)
        setSortedReplicas(sorted)
<<<<<<< Updated upstream
=======
        replicas.forEach(replica => {
            if (replicasAudio.filter(i => i.id === replica._id).length === 0) {
                loadAudio(replica._id)
            } else {
                updateAudio(replica._id)
            }
        })
        const currentTime = newSecondsFromCursor * 1000;
        const closestId = returnClosestId(currentTime);
        setNextReplicaId(closestId)
>>>>>>> Stashed changes
    }, [replicas]);

    const loadNextAudio = (nextIdx) => {
        let idx = 0;
        if (nextIdx === null || nextIdx === undefined) {
            idx = nextReplicaIndex
        } else {
            if (nextIdx === nextReplicaIndex) {
                currentReplicaAudio?.fastSeek(0)
                return
            }
            idx = nextIdx
        }
        setIsPlaying(false)
        if (idx === -1) {
            setCurrentReplica(null)
            setCurrentReplicaAudio(null)
            return
        }
        if (idx === 0) {
            if (!sortedReplicas.length) return
            setCurrentReplica(sortedReplicas[0])
            setCurrentReplicaAudio(new Audio(sortedReplicas[0]?.audioUrl))
            setNextReplicaAudio(new Audio(sortedReplicas[1]?.audioUrl))
            setNextReplicaIndex(1)
            return
        }
        if (idx + 1 < sortedReplicas.length) {
            setCurrentReplicaAudio(nextReplicaAudio)
            setCurrentReplica(sortedReplicas[idx])
            setNextReplicaAudio(new Audio(sortedReplicas[idx + 1]?.audioUrl))
            setNextReplicaIndex(idx + 1)
        } else {
            setCurrentReplicaAudio(nextReplicaAudio)
            setCurrentReplica(replicas[idx])
            setNextReplicaAudio(null)
            setNextReplicaIndex(-1)
        }
    }
    return (
        <div />
     );
}

export default AudioPlayer;