import React from 'react';
import "./CircleButton.css"

const CircleButton = (props) => {
    return (
        <button style={{backgroundColor: props.bgColor, height: props.size, width: props.size}} className="circle-button-container" onClick={props.onClick}>
            <img className='icon' src={props.url} alt="button" />
        </button>
    );
}

export default CircleButton;