import React, { useState, useEffect } from 'react';
import UploadFile from '../../../GenericComponents/Files/UploadFile';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';

export default function ProjectData({ image, setImage, nextStep, prevStep, handleChange, values }) {
    const [thumbnail, setThumbnail] = useState(null);

    const next = e => {
        e.preventDefault();
        nextStep();
    };

    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    useEffect(() => {
        const onImageChange = () => {
            if (image) {
                let reader = new FileReader();

                reader.readAsDataURL(image);
                reader.onload = () => {
                    setThumbnail(reader.result);
                }
            }
        };

        onImageChange();
    }, [image]);

    return (
        <form class="flex w-full h-full">
            <div class="flex flex-wrap w-2/3">
                <div class="w-2/3 h-1/5 px-3 mb-6">
                    <InputWithLabel defaultValue={ values.title } placeholder="Title" type="text" label="Title" onChange={ title => handleChange('name', title) } />
                </div>
                <UploadFile setData={ setImage } isFill={image ? true : false} types=".jpg, .jpeg, .png"/>
            </div>
            { thumbnail ? <img class="object-scale-down w-1/3 h-1/2" src={ thumbnail } alt="Thumbnail"></img> : <div class="flex flex-wrap w-1/3 h-1/2 shadow-xl rounded"></div> }
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
