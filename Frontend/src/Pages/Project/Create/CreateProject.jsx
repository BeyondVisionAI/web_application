import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Payment from './Payment';
import ProjectData from './ProjectData';
import VideoData from './VideoData';
import StepsBar from '../../../GenericComponents/StepsBar/StepsBar';
import DropVideo from './DropVideo';
import { useHistory } from "react-router-dom";
import { UploadFile } from '../../../GenericComponents/Files/S3Manager';

export default function CreateProject({ show, onHide }) {
    const [modalStep, setModalStep] = useState(0);
    const [video, setVideo] = useState(null);
    const [image, setImage] = useState(null);
    const [values, setValue] = useState({
        id: null,
        name: null,
        thumbnailId: null,
        description: null,
        videoId: null,
        videoType: null,
    });
    const [steps, setSteps] = useState([
        {title: 'Téléverser la vidéo', img: <svg class="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z"/></svg>, isDone: true},
        {title: 'Détails du projet', img: <svg class="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z"/></svg>, isDone: false},
        {title: 'Informations sur la vidéo', img: <svg class="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>, isDone: false},
        {title: 'Shop', img: <svg class="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.42z"/></svg>, isDone: false},
    ]);
    const history = useHistory();

    const prevStep = () => {
        let tmpSteps = steps;

        tmpSteps[modalStep].isDone = false;
        setSteps(tmpSteps);
        setModalStep(modalStep - 1);
    }
    const nextStep = () => {
        setModalStep(modalStep + 1);
        let tmpSteps = steps;

        tmpSteps[modalStep + 1].isDone = true;
        setSteps(tmpSteps);
    }

    const handleChange = (input, value) => {
        let tmp = values;

        tmp[input] = value;
        setValue(tmp);
    }

    const postData = async () => {
        try {
            let imageRes = await UploadFile(image, 'bv-thumbnails-projects', 'eu-west-3', `${values.name}_${image.name}`);
            let thumbnailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/images`, {
                name: imageRes.Key,
                desc: `Thumbnail for ${values.name} locate in ${imageRes.bucket} bucket`,
                ETag: imageRes.ETag,
            });
            handleChange('thumbnailId', thumbnailResponse.data._id);
            let videoRes = await UploadFile(video, 'bv-streaming-source-56j5jposuppx', 'us-east-1', `${values.name}_${video.name}`);
            let videoResponse = await axios.post(`${process.env.REACT_APP_API_URL}/videos`, {
                name: videoRes.Key,
                desc: `Video for ${values.name} type ${values.videoType}`,
                ETag: videoRes.ETag,
                url: 'Url Undefined'
            });
            // TODO: Handle loading
            handleChange('videoId', videoResponse.data._id);
            let projectResponse = await axios.post(`${process.env.REACT_APP_API_URL}/projects`, { status: 'Stop', ...values, script: null });
            handleChange('id', projectResponse.data._id);
            history.push(`/project/${projectResponse.data._id}`);
        } catch (error) {
            console.error(error);
        }
    }

    const creationSteps = () => {
        switch (modalStep) {
            case 0:
                return (
                    <DropVideo video={ video } setVideo={ setVideo } nextStep={ nextStep } handleChange={ handleChange } values={ values }/>
                );
            case 1:
                return (
                    <ProjectData image={ image } setImage={ setImage } nextStep={ nextStep } prevStep={ prevStep } handleChange={ handleChange } values={ values }/>
                );
            case 2:
                return (
                    <VideoData nextStep={ nextStep } prevStep={ prevStep } handleChange={ handleChange } values={ values }/>
                );
            case 3:
                return (
                    <Payment prevStep={ prevStep } handleChange={ handleChange } values={ values } postData={ postData }/>
                );
            default:
                return (
                    <DropVideo nextStep={ nextStep } handleChange={ handleChange } values={ values }/>
                );
        }
    }

    const wrapperRef = useRef(null);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    onHide()
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    useOutsideAlerter(wrapperRef);

    return (
        <>
            <div className='justify-center'></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div ref={wrapperRef} className="relative w-full my-6 mx-auto max-w-7xl h-5/6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none h-full focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <StepsBar steps={steps}></StepsBar>
                            <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => onHide()}
                            >
                            <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                            </span>
                            </button>
                        </div>
                        {creationSteps()}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}
// TODO: Handle error and required elements
// TODO: Fix Step bar (logo, titre color)