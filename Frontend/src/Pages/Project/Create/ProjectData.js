import React, { useState } from 'react';

export default function ProjectData({ nextStep, prevStep, handleChange, values }) {
    const [thumbnail, setThumbnail] = useState(values.thumbnail);

    const next = e => {
        e.preventDefault();
        nextStep();
    };

    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    const onImageChange = e => {
        let reader = new FileReader();

        if (e.target.files && e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                handleChange('thumbnail', reader.result);
                setThumbnail(reader.result);
            }
        }
    };

    return (
        <div>
            <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-6 px-10">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
                            Titre
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="title" type="text" defaultValue={ values.title } onChange={ e => handleChange('title', e.target.value) }/>
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="thumbnail">
                            Vignette d'aperçu
                        </label>
                        <input
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="thumbnail"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={ onImageChange }
                        />
                        { thumbnail ? <img class="object-cover" src={ thumbnail }></img> : null }
                    </div>
                    {/* TODO: display all project thumnail */}
                </div>
            </form>
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
        </div>
    )
}
