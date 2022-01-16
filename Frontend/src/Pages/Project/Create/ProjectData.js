import React from 'react';

export default function ProjectData({ nextStep, handleChange, values }) {
    const next = e => {
        e.preventDefault();
        nextStep();
    }

    return (
        <div>
            <label>Title1
                <input
                    type="text"
                    placeholder="Title"
                    value={values.title}
                    onChange={handleChange('title')}
                />
            </label>
            <button onClick={next}>Next</button>
        </div>
    )
}
