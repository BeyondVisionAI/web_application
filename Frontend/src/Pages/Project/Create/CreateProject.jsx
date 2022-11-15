import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ProjectData from './ProjectData';
import VideoData from './VideoData';
import StepsBar from '../../../GenericComponents/StepsBar/StepsBar';
import DropVideo from './DropVideo';
import { useHistory } from "react-router-dom";
import { UploadFileOnS3 } from '../../../GenericComponents/Files/S3Manager';

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
        {title: 'Téléverser la vidéo', img: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload-cloud"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></svg>, isDone: true},
        {title: 'Détails du projet', img: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>, isDone: false},
        {title: 'Paiement', img: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, isDone: false}
    ]);
    
    const history = useHistory();
    axios.defaults.withCredentials = true;

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

    async function uploadMedia () {
        UploadFileOnS3(image, 'bv-thumbnail-project', 'us-east-1', `${values.id}.${image.name.split(".").pop()}`)
        .then(async (imageRes) => {
            let thumbnailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/images`, {
                name: imageRes.Key,
                desc: `Thumbnail for ${values.name} locate in ${imageRes.bucket} bucket`,
                ETag: imageRes.ETag
            });
            handleChange('thumbnailId', thumbnailResponse.data._id);
            axios.patch(`${process.env.REACT_APP_API_URL}/projects/${values.id}`, { thumbnailId: values.thumbnailId });
        }).catch(err => console.error("Upload thumbnail error:", err));

        UploadFileOnS3(video, 'beyondvision-vod-source-km23jds9b71q', 'us-east-1', `${values.id}.${video.name.split(".").pop()}`)
        .then(async videoRes => {
            let videoResponse = await axios.post(`${process.env.REACT_APP_API_URL}/videos`, {
                name: videoRes.Key,
                desc: `Video for ${values.name} type ${values.videoType}`,
                ETag: videoRes.ETag,
                url: 'Undefined'
            });
            handleChange('videoId', videoResponse.data._id);
            axios.patch(`${process.env.REACT_APP_API_URL}/projects/${values.id}`, { videoId: values.videoId });
        }).catch(err => console.error("Upload video error:", err));
    }

    async function postData () {
        try {
            let projectResponse = await axios.post(`${process.env.REACT_APP_API_URL}/projects`, { status: 'Stop', ...values, script: null });
            handleChange('id', projectResponse.data._id);
            await uploadMedia();
            history.push(`/project/${projectResponse.data._id}`);
            await axios.post(`${process.env.REACT_APP_API_URL}/projects/${projectResponse.data._id}/generationIA`, { typeGeneration: 'ActionRetrieve' });
            onHide()
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
                    <VideoData prevStep={ prevStep } handleChange={ handleChange } values={ values } postData={ postData }/>
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