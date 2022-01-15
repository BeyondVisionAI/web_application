import React from 'react';

function StepsBar({ steps }) {
    function step(img, isDone) {
        if (isDone)
            return (
                <div class="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                    <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                        <div class="w-0 bg-green-300 py-1 rounded" style={{ width: '100%' }}></div>
                    </div>
                    <span class="text-center text-white w-full">
                        {img}
                    </span>
                </div>
            );
        return (
                <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                    <span class="text-center text-gray-600 w-full">
                        {img}
                    </span>
                </div>
        );
    }

    function bar(idx, length, isDone) {
        if (idx !== 0 && idx !== length) {
            return (
            <div class="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div class="w-0 bg-green-300 py-1 rounded" style={{ width: isDone ? '100%' : '0%' }}></div>
                </div>
            </div>
            );
        }
    }

    return (
        <div class="w-full py-6">
            <div class="flex">
                {steps.map(({title, img, isDone}, idx, arr) => (
                    <div class={`w-1/${arr.length}`}>
                        <div class="relative mb-2">
                            {bar(idx, arr.length, isDone)}
                            {step(img, isDone)}
                        </div>
                        <div class="text-xs text-center md:text-base">{title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StepsBar
