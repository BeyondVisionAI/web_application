import React from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({ videoUrl }) => {
  console.log(videoUrl);
  return (
    <Widget weight='h-1/5' rounded='rounded-b-lg'>
      <ReactPlayer url='https://d10lu3tsncvjck.cloudfront.net/8340e1ce-b091-478e-93c3-5f3424a75e51/hls/Cristiano_Ronaldo_wink_meme.m3u8' controls={true} />
    </Widget>
  );
}
export default VideoPlayer;