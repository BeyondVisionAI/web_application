import React from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import ReactPlayer from 'react-player';
// import { ReceiveMessage } from '../../../../GenericComponents/Files/S3Manager';

export const VideoPlayer = ({ videoUrl }) => {

  // async function getVidéo() {
  //   await ReceiveMessage();
  //   window.location.reload(false);
  // }

  // if (videoUrl === 'Undefined')
  //   return (<button onClick={() => getVidéo()}>Refresh Vidéo</button>)
  return (
    <Widget weight='h-1/5' rounded='rounded-b-lg'>
      <ReactPlayer url={videoUrl} controls={true} />
    </Widget>
  );
}
export default VideoPlayer;