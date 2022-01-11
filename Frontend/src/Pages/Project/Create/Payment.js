import React from 'react';

export default function Payment({ prevStep, handleChange, values }) {
    const prev = e => {
        e.preventDefault();
        prevStep();
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
        </div>
    )
}
