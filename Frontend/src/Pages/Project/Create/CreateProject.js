import React, { useState } from 'react';
import Payment from './Payment';
import ProjectData from './ProjectData';
import VideoData from './VideoData';

export default function CreateProject({ show, onHide }) {
    const [modalStep, setModalStep] = useState(1);
    const [values, setValue] = useState({
        title: '',
        thumbnails: [],
        resume: '',
        videoType: '',
        collaborator: []
    });

    const prevStep = () => {
        setModalStep(modalStep - 1);
    }
    const nextStep = () => {
        setModalStep(modalStep + 1);
    }

    const handleChange = input => e => {
        let tmp = values;

        tmp[input] = e.target.value;
        setValue(tmp);
    }

    const creationSteps = () => {
        switch (modalStep) {
            case 1:
                return (
                    <ProjectData nextStep={ nextStep } handleChange={ handleChange } values={ values }/>
                );
            case 2:
                return (
                    <VideoData nextStep={ nextStep } prevStep={ prevStep } handleChange={ handleChange } values={ values }/>
                );
            case 3:
                return (
                    <Payment prevStep={ prevStep } handleChange={ handleChange } values={ values }/>
                );
            default:
                return (
                    <ProjectData nextStep={ nextStep } handleChange={ handleChange } values={ values }/>
                );
        }
    }

  return (
    <>
        <div className='justify-center'></div>
        <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                    Modal Title
                    </h3>
                    <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => onHide()}
                    >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                    </span>
                    </button>
                </div>
                {creationSteps()}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onHide()}
                    >
                    Close
                    </button>
                    <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onHide()}
                    >
                    Save Changes
                    </button>
                </div>
                </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}