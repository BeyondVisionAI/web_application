import React from 'react';
import UploadFile from '../../../GenericComponents/Files/UploadFile';

export default function DropVideo({ video, setVideo, nextStep, handleChange, values }) {
    const onClick = e => {
        e.preventDefault();
        nextStep();
    }

  return (
        <form className='h-full'>
            <div className="relative group w-full h-64 flex justify-center items-center">
                <UploadFile
                setData={ setVideo }
                isFill={video ? true : false}
                types=".mov, .mp4, .wav"
                other={ video ? <p className="relative z-20 cursor-pointer text-blue-500 hover:text-blue-600 block">{ video.name }</p> : null }
                />
            </div>
            <div className="absolute bottom-0 right-0 p-6">
                <button
                disabled={ video ? false : true }
                className={`font-bold uppercase text-sm px-6 py-3 rounded shadow focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${video ? 'hover:bg-emerald-600 text-black hover:shadow-lg' : 'cursor-not-allowed text-gray-200'}`}
                type="button"
                onClick={ onClick }
                >
                Next
                </button>
            </div>
        </form>
  );
}