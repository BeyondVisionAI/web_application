import React from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ScriptBoxList from './Components/ScriptBoxList/ScriptBoxList';

const ScriptEdition = ( {script/*, video */}) => {
    return (
        <>
            <div className="script-edition-container h-screen">
                <NavBar />

                <div className="page-container container h-5/6 pt-2 flex flex-col">
                    <h1 className="h-1/6">Project Title</h1>
                    <div className="flex h-3/6 px-1">
                        <div className="flex flex-row w-full justify-around mt-2">
                            <div id="movie-insight" className="flex justify-center content-end w-3/5 rounded-tl-3xl mx-1 p-2 shadow-lg">
                                <img className="object-cover" src="/assets/fight_club.jpeg" alt="" />
                            </div>
                            <div id="script-boxes" className="w-2/5 shadow-lg rounded-tr-3xl mx-1"><ScriptBoxList script={script} /></div>
                            {/* shadow-xl ressembles the most to what's asked on the Figma, but smh doesn't work */}
                        </div>
                    </div>
                    <div className="flex h-2/6 w-full px-2 mt-2">
                        <div id="timeline" className="w-full h-full bg-green-400 rounded-b-3xl shadow-lg">Audio Timeline</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ScriptEdition;