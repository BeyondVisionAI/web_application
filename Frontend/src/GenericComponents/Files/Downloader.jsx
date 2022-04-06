import { DownloadFileUrl } from './S3Manager';
import { useEffect, useState } from 'react';
import "../Button/Button.css"

export function Downloader(props) {
    console.log("Downloader")
    console.log("props :", props);
    const [url, setURL] = useState('');
    const [file, setFile] = useState('')

    useEffect(() => {
        const DownloadFileUrlData = async () => {
            const data = await DownloadFileUrl(props.bucket, props.keyName);

            setURL(data);
        }
        DownloadFileUrlData();
        const path = props.keyName; 
        setFile(path.split('/')[1]);
    }, []);
    
    return (
        <a download={file} target="_blank" href={url} style={{backgroundColor: props.bgColor}}  className="button-container" >{props.label}</a>
    );

}