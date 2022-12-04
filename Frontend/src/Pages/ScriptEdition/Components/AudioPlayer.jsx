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
        if (isPlaying) {
            currentReplicaAudio?.pause()
            setIsPlaying(false)
        }
    }, [triggerPause]);

    useEffect(() => {
        if (!newSecondsFromCursor) return
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
        loadNextAudio()
    }, [sortedReplicas]);

    useEffect(() => {
        if (playedSeconds * 1000 >= currentReplica?.timestamp && !isPlaying) {
            currentReplicaAudio?.play()
            setIsPlaying(true)
        }
    }, [playedSeconds]);

    useEffect(() => {
        let sorted = replicas.sort((a, b) => a.timestamp - b.timestamp)
        setSortedReplicas(sorted)
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