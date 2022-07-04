import { DownloadFileUrl, DownloadFileData } from './S3Manager';
import { useEffect, useState } from 'react';
import "../Button/Button.css";

export function Downloader(props) {
    const downloadFile = async () => {
        const data = await DownloadFileData(props.bucket, props.keyName);
        let blob = new Blob(data, props.fileType);

        const url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download=props.keyName.split('/')[2];
        a.href=url;
        a.click();
    };
    
    return (
        <button style={{backgroundColor: props.bgColor}} className="button-container" onclick={downloadFile()}>{props.label}</button>
    );

}