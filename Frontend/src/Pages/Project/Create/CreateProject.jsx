import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ProjectData from './ProjectData';
import VideoData from './VideoData';
import StepsBar from '../../../GenericComponents/StepsBar/StepsBar';
import DropVideo from './DropVideo';
import { useHistory } from "react-router-dom";
import Toast from '../../../GenericComponents/Toast/Toast.js';

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
        {title: 'Téléverser la vidéo', img: <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path className="heroicon-ui" d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z"/></svg>, isDone: true},
        {title: 'Détails du projet', img: <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path className="heroicon-ui" d="M19 10h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2V8a1 1 0 0 1 2 0v2zM9 12A5 5 0 1 1 9 2a5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5v2z"/></svg>, isDone: false},
        {title: 'Informations sur la vidéo', img: <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path className="heroicon-ui" d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>, isDone: false}
    ]);
    // axios for Upload Percentage
    const [thumbnailUpload, setThumbnailUpload] = useState(null);
    const [videoUpload, setVideoUpload] = useState(null);
    
    // Toast Values
    const [list, setList] = useState([]);
    const [autoDeleteTime, setAutoDeleteTime] = useState(5);

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

    const showToast = (toastProperties) => {
        console.log("Test showToaster", toastProperties);
        setList([...list, toastProperties]);
    };
    
    const setUploadToastChange = (id, percentage) => {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                list[i].description = `${percentage} %`;
            }
        };
    };

    const removeToast = (id) => {
        var newList = list;
        for (var i = 0; i < newList.length; i++) {
            if (newList[i].id === id) {
                newList.splice(i, 1);
                setList(newList);
                return;
            }
        }
    };

    async function uploadMedia () {
        console.log("send Image", image.name, image );
        // const formDataThumbnail = new FormData();
        // formDataThumbnail.append('file', image);

        //TODO Upload by getting a signedUrl from the Back End to Upload the Thumbnail directly on the front
        
        try {
            const responseThumbnail = await axios.post(`${process.env.REACT_APP_API_URL}/mediaManager/Upload/thumbnail`, {objectName: `${values.id}.${image.name.split(".").pop()}`});
            // Le call au dessus retire le .img c'est bon ?
            const urlThumbnailUpload = responseThumbnail.data;
            console.log("🚀 ~ file: CreateProject.jsx ~ line 95 ~ uploadMedia ~ urlThumbnailUpload", urlThumbnailUpload);

            const data = image.read();
            console.log("🚀 ~ file: CreateProject.jsx ~ line 98 ~ uploadMedia ~ image", image)
            
            
            // axios.defaults.headers.put['Access-Control-Allow-Origin'] = '*';
            const imageRes = await axios({
                url: urlThumbnailUpload,
                body: data,
                method: 'PUT'
            });

            // const imageRes = await axios.post(urlThumbnailUpload, {
            //     body: image,
            // });
            console.error("Upload thumbnail Finished - sending info of the file");
            let thumbnailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/images`, {
                name: imageRes.Key,
                desc: `Thumbnail for ${values.name} locate in ${imageRes.bucket} bucket`,
                ETag: imageRes.ETag
            });
            handleChange('thumbnailId', thumbnailResponse.data._id);
            axios.patch(`${process.env.REACT_APP_API_URL}/projects/${values.id}`, { thumbnailId: values.thumbnailId });
        } catch (err) {
            console.error("Upload thumbnail error:", err)
        }
        //TODO Upload by sending the data to Back End

        // await axios.post(`${process.env.REACT_APP_API_URL}/S3Manger/source-product/thumbnail/${values.id}`, { thumbnailData: image, name: image.name, desc: `Thumbnail for ${values.name}` }, {
        //     onUploadProgress: (p) => {
        //         const percentCompleted = Math.round((p.loaded * 100) / p.total);
        //         var id = null;
        //         if (thumbnailUpload === null) {
        //             id = Math.floor((Math.random() * 101) + 1);
        //             showToast({
        //                 id: id,
        //                 title: 'File Uploading : Image',
        //                 description: `${percentCompleted} %`,
        //                 backgroundColor: '#5bc0de',
        //                 icon: "infoIcon"
        //             })
        //         } else {
        //             id = thumbnailUpload.id;
        //         }

        //         setThumbnailUpload({id: id, fileName: image.name, percent: percentCompleted,});
        //         if (percentCompleted === 100) {
        //             // removeToast(id);
        //             const idSuccess = Math.floor((Math.random() * 101) + 1);
        //             showToast({
        //                 id: idSuccess,
        //                 title: 'File Upload : Image',
        //                 description: 'Success',
        //                 backgroundColor: '#5cb85c',
        //                 icon: "checkIcon"
        //             });
        //         } else {
        //             setUploadToastChange(id, percentCompleted);
        //         }
        //     }
        // });
        
        //TODO Upload by sending the data to Back End

        // UploadFileOnS3(image, 'bv-thumbnail-project', 'us-east-1', `${values.id}.${image.name.split(".").pop()}`)
        // .then(async (imageRes) => {
        //     let thumbnailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/images`, {
        //         name: imageRes.Key,
        //         desc: `Thumbnail for ${values.name} locate in ${imageRes.bucket} bucket`,
        //         ETag: imageRes.ETag
        //     });
        //     handleChange('thumbnailId', thumbnailResponse.data._id);
        //     axios.patch(`${process.env.REACT_APP_API_URL}/projects/${values.id}`, { thumbnailId: values.thumbnailId });
        // }).catch(err => console.error("Upload thumbnail error:", err));

        console.log("send Video", video.name,  video);
        // const formDataVideo = new FormData();
        // formDataVideo.append('file', video);

        //TODO Upload by getting a signedUrl from the Back End to Upload the Video directly on the front
        
        try {
            const responseVideo = await axios.get(`${process.env.REACT_APP_API_URL}/mediaManager/Upload/source-video`, {objectName: `${values.id}.${video.name.split(".").pop()}`});
            const urlVideoUpload = responseVideo.data;
            console.log("Video Url :", urlVideoUpload);
            // axios.defaults.headers.put['Access-Control-Allow-Origin'] = '*';
            const videoRes = await axios({
                url: urlVideoUpload,
                body: video,
                method: 'PUT'
            });
            // const videoRes = await axios.put(urlVideoUpload, {
            //     body: video,
            // });
            console.error("Upload video Finished - sending info of the file");
            let videoResponse = await axios.put(`${process.env.REACT_APP_API_URL}/videos`, {
                name: videoRes.Key,
                desc: `Video for ${values.name} type ${values.videoType}`,
                ETag: videoRes.ETag,
                url: 'Undefined'
            });
            handleChange('videoId', videoResponse.data._id);
            axios.patch(`${process.env.REACT_APP_API_URL}/projects/${values.id}`, { videoId: values.videoId });
        } catch (err) {
            console.error("Upload video error:", err);
        }
        //TODO Upload by sending the data to Back End

        // await axios.post(`${process.env.REACT_APP_API_URL}/S3Manger/source-product/video/${values.id}`, { videoData: video, name: video.name, desc: `Video for ${values.name} type ${values.videoType}` }, {
        //     onUploadProgress: (p) => {
        //         const percentCompleted = Math.round((p.loaded * 100) / p.total);
        //         var id = null;
        //         if (videoUpload === null) {
        //             id = Math.floor((Math.random() * 101) + 1);
        //             showToast({
        //                 id: id,
        //                 title: 'File Uploading : Video',
        //                 description: `${percentCompleted} %`,
        //                 backgroundColor: '#5bc0de',
        //                 icon: "infoIcon"
        //             })
        //         } else {
        //             id = videoUpload.id;
        //         }

        //         setVideoUpload({id: id, fileName: video.name, percent: percentCompleted,});
        //         if (percentCompleted === 100) {
        //             // removeToast(id);
        //             const idSuccess = Math.floor((Math.random() * 101) + 1);
        //             showToast({
        //                 id: idSuccess,
        //                 title: 'File Upload : Video',
        //                 description: 'Success',
        //                 backgroundColor: '#5cb85c',
        //                 icon: "checkIcon"
        //             });
        //         } else {
        //             setUploadToastChange(id, percentCompleted);
        //         }
        //     }
        // });

        //TODO Directly Uploading the Video from teh front with Id and secret on the front

        // UploadFileOnS3(video, 'bv-streaming-video-source-ahnauucgvgsf', 'us-east-1', `${values.id}.${video.name.split(".").pop()}`)
        // .then(async videoRes => {
        //     let videoResponse = await axios.post(`${process.env.REACT_APP_API_URL}/videos`, {
        //         name: videoRes.Key,
        //         desc: `Video for ${values.name} type ${values.videoType}`,
        //         ETag: videoRes.ETag,
        //         url: 'Url Undefined'
        //     });
        //     handleChange('videoId', videoResponse.data._id);
        //     axios.patch(`${process.env.REACT_APP_API_URL}/projects/${values.id}`, { videoId: values.videoId });
        // }).catch(err => console.error("Upload video error:", err));
    }

    async function postData () {
        try {
            let projectResponse = await axios.post(`${process.env.REACT_APP_API_URL}/projects`, { status: 'Stop', ...values, script: null });
            handleChange('id', projectResponse.data._id);
            await uploadMedia();
            history.push(`/project/${projectResponse.data._id}`);
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
            <Toast 
                toastList={list}
                position={"top-left"}
                autoDelete={true}
                autoDeleteTime={autoDeleteTime}
            />
        </>
    );
}
// TODO: Handle error and required elements