// import { DownloadFileData } from './S3Manager';
import { useState } from 'react';
import "../Button/Button.css";
import axios from 'axios';

async function downloadFile(props) {
    // axios.defaults.withCredentials = true;
    console.log("Test");
    var response = {};

    if (props.type === 'video-finished-products') {
        console.log("Video");
        response = await axios.get(`${process.env.REACT_APP_API_URL}/S3Manger/finished-product/video/${props.projectId}`);
    } else if (props.type === 'audio-finished-products') {
        console.log("Audio");
        response = await axios.get(`${process.env.REACT_APP_API_URL}/S3Manger/finished-product/audio/${props.projectId}`);
    } else {
        console.log(`Null ?, type : ${props.type}`);
        response.data = null;
    }
    const data = response.data;
    console.log("data :", data);
    if (data !== null && data !== {} && data !== undefined && data !== '') {
        let blob = new Blob([data], { type: props.fileType });
        console.log("blob :", blob);
        const url = URL.createObjectURL(blob);
        console.log("url :", url);
        let a = document.createElement('a');
        a.download=props.fileName;
        a.href=url;
        a.click();
    } else {
        console.log("The data is null.")
    }
};

export function Downloader(props) {
    const [isDownload, setIsDownload] = useState(false);
    const [buttonText, setButtonText] = useState(props.label);

    var handleClick = async () => {
        if (!isDownload) {
            setIsDownload(true);
            setButtonText("Downloading ...");
            await downloadFile(props);
            setIsDownload(false);
            setButtonText(props.label);
        }
    }
    return (
        <button style={{backgroundColor: props.bgColor}} className="button-container" onClick={handleClick}>{buttonText}</button>
    );
}