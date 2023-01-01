import React, { useState, useEffect, useRef } from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import ReactPlayer from 'react-player';
import { useTranslation } from 'react-i18next';

export const VideoPlayer = ({ videoUrl, setDuration, setPlayedSecondsInParent, newSecondsFromCursor, resetNewSecondsFromCursor, setIsPlaying }) => {
  const { t } = useTranslation('translation', {keyPrefix: 'project.manage.videoPlayerWidget'});
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

  useEffect(() => {
    if (setIsPlaying)
      setIsPlaying(playing)
  }, [playing]);

  if (videoUrl === 'Undefined')
    return (<Widget weight='h-1/5' rounded='rounded-b-lg'>{t('uploading')}</Widget>)

  return (
    <div className="h-full drop-shadow-xl">
      <ReactPlayer
      width='100%'
      height='100%'
      url={ videoUrl }
      ref={ playerRef }
      controls={true}
      onDuration={setDuration ? setDuration : () => {}}
      onBuffer={() => setPlaying(false)}
      onBufferEnd={() => setPlaying(true)}
      onSeek={second => setPlayedSeconds(second * 1000)}
      onEnded={() => setPlayedSeconds(0)}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      />
    </div>
  );
}
export default VideoPlayer;