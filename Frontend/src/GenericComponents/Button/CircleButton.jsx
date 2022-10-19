import React from 'react';
import "./CircleButton.css"

const CircleButton = (props) => {
    return (
        <button style={{backgroundColor: props.bgColor}} className="circle-button-container" onClick={props.onClick}>
            <img src={props.url} alt="button" width={props.size}/>
        </button>
    );
}

export default CircleButton;