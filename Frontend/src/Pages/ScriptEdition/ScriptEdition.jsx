import React from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ScriptEditBox from './Components/ScriptEditBox/ScriptEditBox';

const ScriptEdition = () => {
    return (
        <div className="script-edition-container">
            <NavBar />
            <ScriptEditBox />
        </div>
    );
}

export default ScriptEdition;