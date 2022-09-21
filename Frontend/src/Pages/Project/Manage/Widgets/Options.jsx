import React, { useState } from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';

export default function Options({ projectId }) {
  const [options, setOptions] = useState({
    audio: false,
    script: false,
    checkScript: false
  });
  const [audioOption, setAudioOption] = useState([{name: 'Beyond vision IA', selected: true}]);
  const [scriptOption, setScriptOption] = useState([{name: 'Beyond vision IA', selected: true}]);
  const [checkScriptOption, setCheckScriptOption] = useState([{name: 'Beyond vision service', selected: true}]);

  // TODO: Fill option thanks the project data ?

  function createChoice(choices) {
    return choices.map(choice => <option name={choice.name} key={choice.name} selected={choice.selected} >{choice.name}</option>)
  }

  function handleOptionsChange(event, option) {
    const tmpOptions = options;

    options[option] = event.target.value;
    setOptions(tmpOptions);
  }

  return (
    <Widget weight='h-1/4' rounded=''>
      <form>
        <div className='h-1/3'>
          <label className='block inset-y-0 left-0' htmlFor='audio'>Audio generation</label>
          <select className='inset-y-0 right-0 border shadow-sm' name="audioChoices" id="audio" onChange={e => handleOptionsChange(e, 'audio')}>
              { createChoice(audioOption) }
          </select>
        </div>

        <div className='h-1/3'>
          <label className='block inset-y-0 left-0' htmlFor='script'>Script generation</label>
          <select className='inset-y-0 right-0 border shadow-sm' name="scriptChoices" id="script" onChange={e => handleOptionsChange(e, 'script')}>
              { createChoice(scriptOption) }
          </select>
        </div>

        <div className='h-1/3'>
          <label className='block inset-y-0 left-0' htmlFor='checkScript'>Check script</label>
          <select className='inset-y-0 right-0 border shadow-sm' name="checkScriptChoices" id="checkScript" onChange={e => handleOptionsChange(e, 'checkScript')}>
              { createChoice(checkScriptOption) }
          </select>
        </div>
      </form>
    </Widget>
  )
}
