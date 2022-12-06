import React from 'react';

const logosImages = [
    {
        type: "Stop",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-14 w-14" fill="none" viewBox="0 0 26 26" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="13" cy="13" r="10"/>
            <line x1="11" y1="16" x2="11" y2="10"/>
            <line x1="15" y1="16" x2="15" y2="10"/>
        </svg>
    }, {
        type: "Error",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    }, {
        type: "Done",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    }, {
        type: "InProgress",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>
    }, {
        type: "ProjectCreation",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
    }, {
        type: "ActionRetrieve",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/>
            <line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/>
            <line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/>
            <line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/>
            <line x1="1" y1="14" x2="4" y2="14"/>
        </svg>
    }, {
        type: "FaceRecognition",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/>
            <line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/>
            <line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/>
            <line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/>
            <line x1="1" y1="14" x2="4" y2="14"/>
        </svg>
    }, {
        type: "TextGeneration",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"/>
            <line x1="9" y1="20" x2="15" y2="20"/>
            <line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
    }, {
        type: "VoiceGeneration",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
    }, {
        type: "AudioGeneration",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
    }, {
        type: "VideoGeneration",
        image: <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#868EBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
            <polygon points="8.75 16.02 15.5 12.75 8.75 8.48 8.75 16.02"></polygon>
        </svg>
    }
];

export default function SVGLogos({ logoType }) {
    const logo = function () {
        for (const logo of logosImages) {
            if (logo.type === logoType) {
                return (logo.image);
            }
        }
    }
    return (<>
        {logo()}
    </>)
}