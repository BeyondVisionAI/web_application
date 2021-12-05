import React from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ScriptEditBox from './Components/ScriptEditBox/ScriptEditBox';
import ScriptBoxList from './Components/ScriptBoxList/ScriptBoxList';

const ScriptEdition = () => {
    return (
        <div className="script-edition-container">
            <NavBar />

            <h1>Movie Title</h1>
            <ScriptEditBox />
            <ScriptBoxList />
        </div>
    );
}

export default ScriptEdition;