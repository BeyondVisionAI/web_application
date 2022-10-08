import React from 'react';
import { useState, useEffect } from 'react';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';

export default function VideoData({ prevStep, handleChange, values, postData }) {
    const types = [
        "Aucun",
        "Aventure",
        "Action",
        "Drame",
        "Jeunesse",
        "Musical",
        "Policier",
        "Science fiction",
        "Horreur"
    ];
    const [selectedType, setSelectedType] = useState(null);
    const [description, setDescription] = useState(null)
    const [areAllRequiredFieldsFilled, setAreAllRequiredFieldsFilled] = useState(false)
    const next = e => {
        e.preventDefault();
        handleChange('videoType', selectedType)
        handleChange('description', description)
        postData();
    }
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    useEffect(() => {
        if (selectedType && description) setAreAllRequiredFieldsFilled(true)
        else setAreAllRequiredFieldsFilled(false)
    }, [selectedType, description]);

    return (
        <form onSubmit={e => e.preventDefault()} className="w-full h-full">
            <div className="flex p-6">
                <div className="w-3/4 px-3">
                    <InputWithLabel defaultValue={ values.description } placeholder="Résumé de la vidéo" type="textarea" label="Résumé court de la vidéo" onChange={setDescription} />
                </div>
                <div className="w-1/4"></div>
                <div className="w-1/4 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="videoType">
                        Genre de la vidéo
                    </label>
                    <select className="block appearance-none w-full bg-white border border-gray-400 hover:bg-gray-50 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id='videoType' defaultValue={ values.videoType } onChange={(e) => setSelectedType(e.target.value)}>
                        {types.map((element) => (<option key={element}>{element}</option>))}
                    </select>
                </div>
            </div>
            <div className="text-gray-500 text-sm absolute bottom-0 p-10">
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
                disabled={!areAllRequiredFieldsFilled}
                className={`font-bold uppercase text-sm px-6 py-3 rounded shadow focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${areAllRequiredFieldsFilled ? 'hover:bg-emerald-600 text-black hover:shadow-lg' : 'cursor-not-allowed text-gray-200'}`}
                type="button"
                onClick={next}
                >
                Next
                </button>
            </div>
        </form>
    )
}