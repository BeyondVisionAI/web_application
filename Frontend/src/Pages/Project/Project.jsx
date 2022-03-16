import React, { useState } from 'react';
import ScriptEdition from '../ScriptEdition/ScriptEdition';
import CreateProject from './Create/CreateProject';

const projectId = "621c3425d3f549034a3e74a4";

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
            <ScriptEdition project={{title: "Titre du projet", projectId: projectId}} />
        </>
    );
}
// TODO: use langage variable