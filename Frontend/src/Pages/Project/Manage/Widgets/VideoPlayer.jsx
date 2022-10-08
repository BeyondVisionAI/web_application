import React, { useState, useEffect, useRef } from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({ videoUrl, setDuration, setPlayedSecondsInParent, newSecondsFromCursor, resetNewSecondsFromCursor }) => {
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null)

  useEffect(() => {
    let interval;
      if (playing) {
        interval = setInterval(() => {
          setPlayedSeconds((prevTime) => prevTime + 10);
        }, 10);
      } else if (!playing) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (setPlayedSecondsInParent) setPlayedSecondsInParent(playedSeconds / 1000)
  }, [playedSeconds, setPlayedSecondsInParent]);

  useEffect(() => {
    if (newSecondsFromCursor) {
      playerRef?.current?.seekTo(newSecondsFromCursor, 'seconds')
      setPlayedSeconds(newSecondsFromCursor * 1000)
      resetNewSecondsFromCursor()
    }
  }, [newSecondsFromCursor, resetNewSecondsFromCursor]);


  if (videoUrl === 'Undefined')
    return (<Widget weight='h-1/5' rounded='rounded-b-lg'>Uploading ...</Widget>)

  return (
    <Widget weight='h-1/5' rounded='rounded-b-lg'>
      <ReactPlayer
      url={videoUrl}
      ref={ playerRef }
      controls={true}
      onDuration={setDuration ? setDuration : null}
      onBuffer={() => setPlaying(false)}
      onBufferEnd={() => setPlaying(true)}
      onSeek={second => setPlayedSeconds(second * 1000)}
      onEnded={() => setPlayedSeconds(0)}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      />
    </Widget>
  );
}
export default VideoPlayer;