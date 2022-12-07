import React from 'react';
import "./DisabledCircleButton.css"

const DisabledCircleButton = (props) => {
    return (
        <button style={{backgroundColor: props.bgColor}} className="diabled-circle-button-container" onClick={props.onClick} disabled>
            <img className='icon' src={props.url} alt="button" />
        </button>
    );
}

export default DisabledCircleButton;