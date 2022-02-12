import React from 'react';
import "./StepsBar.css"

function StepsBar({ steps }) {
    function step(img, isDone) {
        return (
            <div class={`w-10 h-10 mx-auto bg-white rounded-full text-lg text-white flex items-center ${isDone ? "step-active" : "border-2 border-gray-200"}`}>
                <span class={`text-center w-full ${isDone ? "step-icon-active" : "text-gray-600"}`}>
                    {img}
                </span>
            </div>
        )
    }

    function bar(idx, length, isDone) {
        if (idx !== 0 && idx !== length) {
            return (
            <div class="relative flex w-1/2 top-1/2 -left-1/4">
                <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div class={`w-0 bg-green-300 py-1 rounded ${isDone ? "progress-bar-active" : null}`}></div>
                </div>
            </div>
            );
        } else {
            // bullshit pour recreer le padding
            return (
            <div style={{opacity: '0'}} class="relative flex w-1/2 top-1/2 -left-1/4">
                <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    { isDone ? <div class="w-0 bg-green-300 py-1 rounded progress-bar-active"></div> : null }
                </div>
            </div>
            )
        }
    }

    return (
        <div class="w-full py-6">
            <div class="flex w-full content-center place-content-around">
                {steps.map(({title, img, isDone}, idx, arr) => (
                    <div key={idx} class="flex flex-col w-full">
                        <div class="mb-2 flex flex-col w-full">
                            { bar(idx, arr.length, isDone) }
                            { step(img, isDone) }
                        </div>
                        <div class="text-xs text-center md:text-base">{title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StepsBar
