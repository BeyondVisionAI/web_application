import React from 'react';
import "./InputWithLabel.css"
import { useState, useEffect } from 'react';
import validator from 'validator'
import PropTypes from 'prop-types';

const InputWithLabel = (props) => {
    const [isValid, setIsValid] = useState(true)
    const [text, setText] = useState()

    useEffect(() => {
        if (props.defaultValue) {
            setText(props.defaultValue)
        }
    }, [props.defaultValue]);


    function checkValidity() {
        const regex = new RegExp(props.verifyRegex);
        if (!text) {
            setIsValid(true)
            return
        }
        if (text.length === 0) {
            setIsValid(true)
            return
        }
        if (props.verifyRegex === 'email') {
            if (validator.isEmail(text)) {
                setIsValid(true)
            } else {
                setIsValid(false)
            }
            return
        }
        if (!regex.test(text)) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    if (props.type === 'textarea') {
        return(
            <div className="input-with-label-container">
                <label className="input-with-label-label">{props.label}</label>
                <textarea
                onChange={e => {
                    props.onChange(e.target.value);
                    setText(e.target.value);
                }}
                className="input-with-label-input"
                placeholder={props.placeholder}
                onBlur={checkValidity}
                name={props.label}
                id={props.label}
                value={text}
                style={{width: props.fullWidth ? '100%' : '60%'}}/>
                {isValid ? null: <p className="input-with-label-error">{props.errorMessage}</p>}
            </div>
        )
    }

    return (
        <div className="input-with-label-container">
            <label className="input-with-label-label">{props.label}</label>
            <input pattern={props.verifyRegex === "email" ? ".+" : props.verifyRegex}
            onBlur={checkValidity}
            placeholder={props.placeholder}
            className="input-with-label-input"
            type={props.type} accept={props.accept} onChange={(arg) => {
                if (props.type === 'file') {
                    props.onChange(arg.target.files[0])
                } else {
                    props.onChange(arg.target.value)
                    setText(arg.target.value)
                }
            }}
            name={props.label}
            id={props.label}
            value={text}
            style={{width: props.fullWidth ? '100%' : '60%'}}/>
            {isValid ? null: <p className="input-with-label-error">{props.errorMessage}</p>}
        </div>
    );
}

InputWithLabel.propTypes = {
    verifyRegex: PropTypes.string,
    errorMessage: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
}

export default InputWithLabel;

// TODO: Has a value to know if the input is correct or no. => can't valide the form without this value