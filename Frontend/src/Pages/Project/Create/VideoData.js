import React from 'react';

export default function VideoData({ nextStep, prevStep, handleChange, values }) {
    const next = e => {
        e.preventDefault();
        nextStep();
    }
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <div>
            <label>Title2
                <input
                    type="text"
                    placeholder="Title"
                    value={values.title}
                    onChange={handleChange('title')}
                />
            </label>
            <button onClick={next}>Next</button>
            <button onClick={prev}>Prev</button>
        </div>
    )
}
