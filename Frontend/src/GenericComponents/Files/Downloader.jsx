// import { DownloadFileData } from './S3Manager';
import { useState } from 'react';
import "../Button/Button.css";
import axios from 'axios';
const AWS = require('aws-sdk')

const s3 = new AWS.S3()
AWS.config.update({accessKeyId: 'your access key', secretAccessKey: 'you secret key'})

async function downloadFile(props) {
    axios.defaults.withCredentials = true;
    var response = {};

    if (props.type === 'video-finished-products') {
        console.log("Video");
        response = await axios.get(`${process.env.REACT_APP_API_URL}/S3Manger/finished-product/video/download-url/${props.projectId}`);
    } else if (props.type === 'audio-finished-products') {
        console.log("Audio");
        response = await axios.get(`${process.env.REACT_APP_API_URL}/S3Manger/finished-product/audio/download-url/${props.projectId}`);
    } else {
        console.log(`Null ?, type : ${props.type}`);
        response.data = null;
    }
    const url = response.data;

    if (url !== null && url !== {} && url !== undefined && url !== '') {
        response = await axios.get(url);
        var data = response.data;
        if (data !== null && data !== {} && data !== undefined && data !== '') {
            var blob = new Blob([response.data]);
            var blobUrl = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download=props.fileName;
            a.href=blobUrl;
            // a.href=url;
            a.click();
            
        }
    }
}

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