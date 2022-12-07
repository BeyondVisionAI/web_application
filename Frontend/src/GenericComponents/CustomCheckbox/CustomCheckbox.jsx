import React, { useState, useEffect } from 'react'
import './CustomCheckbox.css'

const CustomCheckbox = ({label, onChange, defaultState, style}) => {
    const [isChecked, setIsChecked] = useState(defaultState !== undefined ? defaultState : false)

    const handleClick = () => {
        onChange(!isChecked)
        setIsChecked(!isChecked)
    }

    useEffect(() => {
        setIsChecked(defaultState)
    }, [defaultState]);

    return ( 
        <div className='custom-checkbox-container' onClick={handleClick} style={style}>
            <div className='custom-checkbox-checkbox-container'>
                <div className={`custom-checkbox-checkbox-active ${isChecked && 'custom-checkbox-checkbox-active-visible'}`}/>
            </div>
            <p className='custom-checkbox-checkbox-label'>{label}</p>
        </div>
     );
}
 
export default CustomCheckbox;