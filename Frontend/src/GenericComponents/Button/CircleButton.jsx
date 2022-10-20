import React from 'react';
import "./CircleButton.css"

const CircleButton = (props) => {
    return (
        <button style={{backgroundColor: props.bgColor}} className="circle-button-container" onClick={props.onClick}>
            <img className='icon' src={props.url} alt="button" />
        </button>
    );
}

export default CircleButton;