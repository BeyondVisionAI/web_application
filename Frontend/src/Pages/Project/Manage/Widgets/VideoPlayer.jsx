import React from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({ videoUrl, playerRef, setDuration }) => {
  console.log("🚀 ~ file: VideoPlayer.jsx ~ line 6 ~ VideoPlayer ~ videoUrl", videoUrl)
  if (videoUrl === 'Undefined')
    return (<Widget weight='h-1/5' rounded='rounded-b-lg'>Uploading ...</Widget>)

  return (
    <Widget weight='h-1/5' rounded='rounded-b-lg'>
      <ReactPlayer url={videoUrl} ref={ playerRef } controls={true} onDuration={setDuration}/>
    </Widget>
  );
}
export default VideoPlayer;