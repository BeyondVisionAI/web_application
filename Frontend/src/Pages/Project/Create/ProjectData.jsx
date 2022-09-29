import React, { useState, useEffect } from 'react';
import UploadFile from '../../../GenericComponents/Files/UploadFile';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';

export default function ProjectData({ image, setImage, nextStep, prevStep, handleChange, values }) {
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState(values.title || '');
    const [localImage, setLocalImage] = useState(null);
    const [areAllRequiredFieldsFilled, setAreAllRequiredFieldsFilled] = useState(false)

    const next = e => {
        e.preventDefault();
        handleChange('name', title)
        setImage(localImage)
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
        if (title.length > 0 && localImage) setAreAllRequiredFieldsFilled(true)
        else setAreAllRequiredFieldsFilled(false)
    }, [title, localImage]);

    return (
        <form className="flex w-full h-full">
            <div className="flex flex-wrap w-2/3">
                <div className="w-2/3 h-1/5 px-3 mb-6">
                    <InputWithLabel defaultValue={ values.title } placeholder="Title" type="text" label="Title" onChange={setTitle} />
                </div>
                <UploadFile setData={ setLocalImage } isFill={image ? true : false} types=".jpg, .jpeg, .png"/>
            </div>
            { thumbnail ? <img className="object-scale-down w-1/3 h-1/2" src={ thumbnail } alt="Thumbnail"></img> : <div className="flex flex-wrap w-1/3 h-1/2 shadow-xl rounded"></div> }
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
