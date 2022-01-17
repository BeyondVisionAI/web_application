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
                    value={values.title}
                    onChange={handleChange('title')}
                />
            </label>
            <button onClick={prev}>Prev</button>
            <button onClick={create}>Create</button>
        </div>
    )
}
