import React from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';

export default function VideoPlayer({ videoUrl }) {

  return (
    <Widget weight='h-1/5' rounded='rounded-b-lg'>
        {videoUrl}
    </Widget>
  )
}
