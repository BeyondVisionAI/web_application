import React from 'react';

export default function UploadFile({ setData, isFill, types, other })
{
    return(
        <div className='relative group h-1/5 justify-center items-center'>
            <input
                className='relative z-10 cursor-pointer w-full h-full opacity-0'
                id='thumbnail'
                type='file'
                accept={types}
                onChange={e => setData(e.target.files[0])}
                required
            />
            <div className='absolute top-0 right-0 bottom-0 left-0 w-full h-full m-auo flex items-center justify-center'>
                <div className={`${ isFill ? null : 'animate-pulse' } space-y-6 text-center group-hover:scale-105 transition duration-300`}>
                    <img src='https://img.icons8.com/dotty/80/000000/upload.png' className='w-20 m-auto' alt='illustration'/>
                    <p className='text-gray-700 text-lg'>Drag and drop a file</p>
                    { other }
                </div>
            </div>
        </div>
        );
}
