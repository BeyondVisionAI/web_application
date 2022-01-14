import React from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ScriptEditBox from './Components/ScriptEditBox/ScriptEditBox';
import ScriptBoxList from './Components/ScriptBoxList/ScriptBoxList';

const ScriptEdition = () => {
    return (
        <div className="script-edition-container">
            {/* <NavBar /> */}

            <h1>Project Title</h1>
            <div id="movie-insight"></div>
                
            <ScriptBoxList />
        </div>
    );
}

export default ScriptEdition;