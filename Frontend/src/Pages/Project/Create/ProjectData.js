import React from 'react';

export default function ProjectData({ nextStep, handleChange, values }) {
    const next = e => {
        e.preventDefault();
        nextStep();
    }

    return (
        <div>
            <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-6 px-10">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
                            Titre
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="title" type="text"/>
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="thumbnail">
                            Vignette d'aperçu
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="thumbnail" type="file" placeholder="Doe"/>
                    </div>
                    {/* TODO: display all project thumnail */}
                </div>
            </form>
            <button onClick={next}>Next</button>
        </div>
    )
}
