import React, { useState } from 'react';
import UploadFile from '../../../GenericComponents/Files/UploadFile';

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
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            let reader = new FileReader();

            formData.append("name", e.target.files[0].name);
            formData.append("description", `${e.target.files[0].name} of project ${values.title}`); // TODO Fix title null
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setThumbnail(reader.result);
                formData.append("buffer", reader.result);
                handleChange('thumbnail', formData);
            }
        }
    };

    return (
        <form class="flex w-full h-full">
            <div class="flex flex-wrap w-2/3">
                <div class="w-2/3 h-1/5 px-3 mb-6">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
                        Titre
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="title" type="text" defaultValue={ values.title } required onChange={ e => handleChange('title', e.target.value) }/>
                </div>
                <UploadFile inputChange={ onImageChange } isFill={thumbnail ? true : false} types=".jpg, .jpeg, .png"/>
            </div>
            <div class="flex flex-wrap w-1/3 h-1/2 shadow-xl rounded">
                { thumbnail ? <img class="object-cover" src={ thumbnail }></img> : null }
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
