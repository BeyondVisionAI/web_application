import { useState } from 'react';
import "../Button/Button.css";
import axios from 'axios';

export function GenerationIA(props) {
    const [isDownload, setIsDownload] = useState(false);
    const [buttonText, setButtonText] = useState(props.label);

    var handleClick = async () => {
        if (!isDownload) {
            setIsDownload(true);
            setButtonText("Generating...");
            axios.post(`${process.env.REACT_APP_API_URL}/projects/${projectId}/generationIA`, { typeGeneration: props.typeGeneration })
            setIsDownload(false);
            setButtonText(props.label);
        }
    }
        if (setButtonText) {
            return (<button style={{backgroundColor: props.bgColor}}
                        className="button-container"
                        onClick={handleClick}>{buttonText}</button>);
        } else {
            return (<a style={{backgroundColor: props.bgColor}} className="button-container">{buttonText}</a>);
        }
}