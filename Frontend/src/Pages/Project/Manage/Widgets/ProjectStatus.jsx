import React from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';

export default function ProjectStatus({ actualStep }) {
  return (
    <Widget weight='h-1/4' rounded='rounded-t-lg'>
        {actualStep}
    </Widget>
  )
}
