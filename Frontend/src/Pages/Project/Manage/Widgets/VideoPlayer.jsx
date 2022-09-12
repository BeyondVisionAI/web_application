import React from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({ videoUrl }) => {
  if (videoUrl === 'Undefined')
    return (<Widget weight='h-1/5' rounded='rounded-b-lg'>Uploading ...</Widget>)

  return (
    <Widget weight='h-1/5' rounded='rounded-b-lg'>
      <ReactPlayer url={videoUrl} controls={true} />
    </Widget>
  );
}
export default VideoPlayer;