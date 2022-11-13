import React, { useState } from 'react'
import './CustomCheckbox.css'

const CustomCheckbox = ({label, onChange, defaultState, style}) => {
    const [isChecked, setIsChecked] = useState(defaultState || false)
    console.log("🚀 ~ file: CustomCheckbox.jsx ~ line 6 ~ CustomCheckbox ~ isChecked", isChecked)

    const handleClick = () => {
        onChange(!isChecked)
        setIsChecked(!isChecked)
    }

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