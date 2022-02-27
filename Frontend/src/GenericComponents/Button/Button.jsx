import React from 'react';
import "./Button.css"

const Button = (props) => {
    return (
        <div style={{backgroundColor: props.bgColor}} className="button-container" onClick={props.onClick}>
            <p className="button-text">{props.label}</p>
        </div>
    );
}

export default Button;