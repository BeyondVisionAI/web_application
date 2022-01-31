import React from 'react';

export default function Payment({ prevStep, handleChange, values, postData }) {
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    const create = e => {
        e.preventDefault();
        postData();
    }

    return (
        <div>
            <label>Title3
                <input
                    type="text"
                    placeholder="Title"
                    defaultValue={ values.title }
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </label>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
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
                onClick={create}
                >
                Payer
                </button>
            </div>
        </div>
    )
}
