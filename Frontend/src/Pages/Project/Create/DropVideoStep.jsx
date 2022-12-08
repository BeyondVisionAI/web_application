import React, { useEffect, useState } from 'react';
import UploadFile from '../../../GenericComponents/Files/UploadFile';
import VideoPlayer from '../Manage/Widgets/VideoPlayer';

export default function DropVideoStep({ video, setVideo, nextStep, handleChange }) {
    const [videoDuration, setVideoDuration] = useState(null);
    const onClick = e => {
        e.preventDefault();
        nextStep();
    }

    useEffect(() => {
        if (videoDuration != null) {
            handleChange("videoDuration", videoDuration);
        }
    }, [videoDuration]);

    return (
        <form className='h-full flex flex-col'>
            <div className="relative group w-full h-full flex justify-center items-center">
                { !video ?
                    <UploadFile
                    setData={ setVideo }
                    isFill={video ? true : false}
                    types=".mov, .mp4, .wav"
                    text="Drag and drop your video !"
                    other={ video ? <p className="relative z-20 cursor-pointer text-blue-500 hover:text-blue-600 block">{ video.name }</p> : null }
                    />
                    :
                    <div className='flex flex-col h-full mt-4'>
                        <VideoPlayer videoUrl={URL.createObjectURL(video)} setDuration={ setVideoDuration }/>
                        <div className='flex flex-row justify-between bg-black rounded-b'>
                            <p className="my-2 ml-4 input-with-label-label text-white align-middle">
                                {video.name}
                            </p>
                            <button className='mr-4 my-2 text-red-700 left-0 align-middle' onClick={() => setVideo(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    </div>
                }
            </div>
            <div className="w-full p-6 mt-4 flex">
                <button
                disabled={ video ? false : true }
                className={`ml-auto font-bold uppercase text-sm px-6 py-3 rounded shadow focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${video ? 'hover:bg-emerald-600 text-black hover:shadow-lg' : 'cursor-not-allowed text-gray-200'}`}
                type="button"
                onClick={ onClick }
                >
                Next
                </button>
            </div>
        </form>
    );
}
