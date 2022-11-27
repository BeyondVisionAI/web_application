import React, { useState, useEffect } from 'react';
import UploadFile from '../../../GenericComponents/Files/UploadFile';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';
import ThumbnailDisplay from './ThumbnailDisplay';
import CollaboratorInput from '../../../GenericComponents/InputWithLabel/CollaboratorInput';

export default function ProjectDataStep({ image, setImage, nextStep, prevStep, handleChange, values, collaborators, setCollaborators }) {
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
    const [description, setDescription] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState(values.name || '');
    const [localImage, setLocalImage] = useState(null);
    const [areAllRequiredFieldsFilled, setAreAllRequiredFieldsFilled] = useState(false)

    const next = e => {
        e.preventDefault();
        handleChange('videoType', selectedType);
        handleChange('description', description);
        handleChange('name', title);
        setImage(localImage);
        nextStep();
    };

    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    useEffect(() => {
        const onImageChange = () => {
            if (localImage) {
                let reader = new FileReader();

                reader.readAsDataURL(localImage);
                reader.onload = () => {
                    setThumbnail(reader.result);
                }
            }
        };

        onImageChange();
    }, [localImage]);

    useEffect(() => {
        if (title.length > 0 && (thumbnail || image) && selectedType && description) // TODO: SelectedType = null en créant le component
            setAreAllRequiredFieldsFilled(true);
        else
            setAreAllRequiredFieldsFilled(false);
    }, [title, thumbnail, image, selectedType, description]);

    return (
        <form className="flex w-full h-full">
            <div className="flex flex-col justify-start p-6 w-2/3">
                <InputWithLabel defaultValue={ values.name } placeholder="Title" type="text" label="Title" onChange={setTitle} />
                <InputWithLabel defaultValue={ values.description } placeholder="Résumé de la vidéo" type="textarea" label="Résumé court de la vidéo" onChange={setDescription} />
                <label className="input-with-label-label" htmlFor="videoType">
                    Genre de la vidéo
                </label>
                <select className="input-with-label-input" id='videoType' defaultValue={ values.videoType } onChange={(e) => setSelectedType(e.target.value)}>
                    {types.map((element) => (<option key={element}>{element}</option>))}
                </select>
                <div className='flex'>
                    <CollaboratorInput defaultValue={ "" } collaborators={ collaborators } setCollaborators={ setCollaborators } />
                </div>
            </div>

            <div className="flex flex-wrap w-1/3 h-1/2 shadow-xl rounded items-center justify-center">
                {(!thumbnail && !image) && <UploadFile text="Drag and drop your thumbnail !" setData={ setLocalImage } isFill={image ? true : false} types=".jpg, .jpeg, .png"/>}
                { (thumbnail || image) && <ThumbnailDisplay thumbnail={image || thumbnail} removeThumbnail={() => {setThumbnail(null); setImage(null)}} />}
            </div>
            <div className="text-gray-500 text-sm absolute bottom-0 left-0 px-6 py-10">
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
