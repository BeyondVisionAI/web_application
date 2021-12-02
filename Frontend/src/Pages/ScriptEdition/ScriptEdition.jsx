import React, { useEffect, useState } from 'react'
import NavBar from './../../GenericComponents/NavBar/NavBar';

// import { ReactDOM } from 'react';
// import MDEditor from '@uiw/react-md-editor';
// import Remarkable from 'remarkable';

const ScriptEdition = () => {
    const [textBlock, setTextBlock] = useState("Python Best Language.");
    const [timer, setTimer] = useState(0);

    const refreshRate = 60 * 2; // 2 minutes
    const dateOptions = {weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'};

    const handleChange = (event) => {
        setTextBlock(event.target.value);

        // TODO handle the user to mark it in the text to be saved
    };

    const [timeDebug, setDate] = useState("Saved at " + new Date().toLocaleDateString("en-US", dateOptions));


    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer + 1);

            if (timer >= refreshRate) {
                saveScriptToDB();
                setTimer(0);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }/*, [] */); // TODO check this

    function displaySaveDate() // TODO Alert component
    {
        setDate("Saved at " + new Date().toLocaleDateString("en-US", dateOptions));
    }

    function saveScriptToDB()
    {
        console.log("Save Script to the DB");
        displaySaveDate();
    }

    function manualScriptSave()
    {
        saveScriptToDB();
        setTimer(0);
    }

    return (
        <div>
            <h1>Script Edition</h1>
            <label htmlFor="markdown-content">
                Script
            </label>
            <textarea
                id="markdown-content"
                onChange={handleChange}/>
            <h3>{textBlock}</h3>
            <button onClick={manualScriptSave}>
                Save script
            </button>
            <div>
                <h3>Debug :</h3>
                <p id="debug-output">
                    {timeDebug}
                </p>
            </div>
        </div>
    );
}   // TODO 
    // Alert React Component for time save
    // Do not save if the user didn't update the thing

export default ScriptEdition;