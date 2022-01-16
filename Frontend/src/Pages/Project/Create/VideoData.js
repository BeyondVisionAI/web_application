import React from 'react';

export default function VideoData({ nextStep, prevStep, handleChange, values }) {
    const types = ["Dramatique", "Humoristique"];
    const next = e => {
        e.preventDefault();
        nextStep();
    }
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <div>
            <form class="w-full max-w-lg">
                <div class="flex flex-wrap">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="resume">
                            Résumé court de la vidéo
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="resume" type="textarea"/>
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="videoType">
                            Genre de la vidéo
                        </label>
                        <select class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id='videoType'>
                            {types.map((element) => (<option>{element}</option>))}
                        </select>
                    </div>
                    <div class="text-gray-500">
                        <h1>Les informations fournies ci-dessus nous aiderons à audio-décrire votre vidéo plus éfficacement.</h1>
                    </div>
                </div>
            </form>
            <button onClick={next}>Next</button>
            <button onClick={prev}>Prev</button>
        </div>
    )
}
