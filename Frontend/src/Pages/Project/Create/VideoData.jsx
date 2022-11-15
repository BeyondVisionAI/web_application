import React, { useState } from 'react';

export default function VideoData({ prevStep, handleChange, values, postData }) {
    const [areAllRequiredFieldsFilled, setAreAllRequiredFieldsFilled] = useState(false)
    const next = e => {
        e.preventDefault();
        postData();
    }
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <form onSubmit={e => e.preventDefault()} className="w-full h-full">
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