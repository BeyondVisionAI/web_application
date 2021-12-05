import { React, useEffect, useState } from 'react'

const ScriptEditBox = () => {
    const [textBlock, setTextBlock] = useState("script text");
    const [timer, setTimer] = useState(0);

    const refreshRate = 60 * 2; // 2 minutes
    const dateOptions =
    {
        weekday: 'short', year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const [timeDebug, setDate] = useState("Saved at " + new Date().toLocaleDateString("en-US", dateOptions));

    const handleBlockEvent = (event) => {
        setTextBlock(event.target.value);
    }

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
        }
    }/*, [] */); // TODO check this

    function displaySaveDate() // TODO alert/popup component?
    {
        setDate("Saved at " + new Date().toLocaleDateString("en-US", dateOptions));
    }

    function saveScriptToDB()
    {
        console.log("Save script to the DB"); // TODO temp
        displaySaveDate();

        // TODO parse/treat/handle the details before saving it in the DB (userID, date, modifications)
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
                onChange={handleBlockEvent}/>
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
}
// TODO Alert/Popup React Component for time save
// Do not save if the user didn't update anything (afk)

export default ScriptEditBox;