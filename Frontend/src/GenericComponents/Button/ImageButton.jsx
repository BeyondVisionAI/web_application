import React from 'react';
import "./ImageButton.css"
import SVGLogos from '../SVGLogos/SVGLogos';

const ImageButton = (props) => {
    return (
        <button style={{ backgroundColor: props.bgColor }} className={ (props.disabled) ? ('disabled-circle-button-container') : ('circle-button-container') }
                onClick={ props.onClick } disabled={ props.disabled }>
            <SVGLogos logoType={ props.type }/>
        </button>
    );
}

export default ImageButton;