import React from 'react';
import "./Button.css"

const Button = (props) => {
    return (
        <button disabled={ props.disabled } style={{ backgroundColor: props.bgColor }} className="button-container" onClick={ props.onClick }>
            <p className="button-text">{ props.label }</p>
        </button>
    );
}

export default Button;