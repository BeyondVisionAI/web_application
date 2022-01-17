import React from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ScriptEditBox from './Components/ScriptEditBox/ScriptEditBox';
import ScriptBoxList from './Components/ScriptBoxList/ScriptBoxList';

const projectID = 1;

const ScriptEdition = ( {script/*, video */}) => {
    const [scriptContent, setScriptContent] = useState([]);

    parseScript(script) = () => {
        setScriptContent(script.content);
    }
    return (
        <>
        {parseScript(script)}
        <div className="script-edition-container h-screen">
            <NavBar />

            <div className="page-container container h-5/6 pt-2 flex flex-col">
                <h1 className="h-1/6">Project Title</h1>
                <div className="flex h-3/6 px-1">
                    <div className="flex flex-row w-full justify-around mt-2">
                        <div id="movie-insight" className="w-3/5 bg-red-500 mx-1">
                            <img className="object-cover" src="./fight_club.jpeg" alt="movie insight" />
                        </div>
                        <div id="script-boxes" className="w-2/5 bg-blue-300 mx-1"><ScriptBoxList script={scriptContent} /></div>
                    </div>
                </div>
                <div className="flex h-2/6 w-full px-2 mt-2">
                    <div id="timeline" className="w-4/5 h-1/2 bg-green-400">...</div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ScriptEdition;
// Frontend/src/Pages/ScriptEdition/ScriptEdition.jsx