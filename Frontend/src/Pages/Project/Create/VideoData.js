import React from 'react';

export default function VideoData({ nextStep, prevStep, handleChange, values }) {
    const types = ["Aucun", "Dramatique", "Humoristique"];
    const next = e => {
        e.preventDefault();
        nextStep();
    }
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <form class="w-full h-full">
            <div class="flex p-6">
                <div class="w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="resume">
                        Résumé court de la vidéo
                    </label>
                    <textarea class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="resume" defaultValue={ values.resume } onChange={(e) => handleChange('resume', e.target.value)}/>
                </div>
                <div class="w-1/4"></div>
                <div class="w-1/4 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="videoType">
                        Genre de la vidéo
                    </label>
                    <select class="block appearance-none w-full bg-white border border-gray-400 hover:bg-gray-50 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id='videoType' defaultValue={ values.videoType } onChange={(e) => handleChange('videoType', e.target.value)}>
                        {types.map((element) => (<option key={element}>{element}</option>))}
                    </select>
                </div>
            </div>
            <div class="text-gray-500 text-sm absolute bottom-0 p-10">
                <h1>Les informations fournies ci-dessus nous aiderons à audio-décrire votre vidéo plus éfficacement.</h1>
            </div>
            <div className="absolute bottom-0 right-0 p-6">
                <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={prev}
                >
                Back
                </button>
                <button
                className="bg-emerald-500 text-blue active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={next}
                >
                Next
                </button>
            </div>
        </form>
    )
}
