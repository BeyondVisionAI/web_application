import React, { useState } from 'react';
import ScriptEdition from '../ScriptEdition/ScriptEdition';
import CreateProject from './Create/CreateProject';

const tempScriptVariable = [
    {
        replica: "This is a replica of the script",
        lastEditor: "Tim"
    },
    {
        replica: "Nice shot!",
        lastEditor: "Dimi"
    },
    {
        replica: "What a save!",
        lastEditor: "Fabien"
    },
    {
        replica: "Close One!",
        lastEditor: "Paul"
    }
    //, {
    //     replica: "One. More. Game.",
    //     lastEditor: "Marco"
    // },
    // {
    //     replica: "Take the shot!",
    //     lastEditor: "Léo"
    // },
    // {
    //     replica: "Whew.",
    //     lastEditor: "Matthieu"
    // },
    // {
    //     replica: "Noooooo!",
    //     lastEditor: "Alex"
    // }
];


export default function Project() {
    const [modalShow, setShowModal] = useState(false);

    return (
        <>
            <button
                className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >Create project</button>

            {modalShow ? (
                <CreateProject
                    show={modalShow}
                    onHide={() => setShowModal(false)}
                />
            ): null}
            <ScriptEdition script={tempScriptVariable} />
        </>
    );
}
// TODO: use langage variable