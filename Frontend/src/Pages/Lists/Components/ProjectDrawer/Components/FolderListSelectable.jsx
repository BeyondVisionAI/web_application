import React from 'react'
import CustomCheckbox from '../../../../../GenericComponents/CustomCheckbox/CustomCheckbox';
import "./FolderListSelectable.css"

const FolderListSelectable = ({project}) => {
    return (
        <div className='folder-list-selectable-container'>
            <div className='folder-list-selectable-options-container'>
                <CustomCheckbox label="Folder #1" onChange={(e) => console.log(e)} defaultState={false} style={{height: '6vh'}}/>
                <CustomCheckbox label="Folder #2" onChange={(e) => console.log(e)} defaultState={true} style={{height: '6vh'}}/>
                <CustomCheckbox label="Folder #3" onChange={(e) => console.log(e)} defaultState={false} style={{height: '6vh'}}/>
                <CustomCheckbox label="Folder #4" onChange={(e) => console.log(e)} defaultState={false} style={{height: '6vh'}}/>
                <CustomCheckbox label="Folder #5" onChange={(e) => console.log(e)} defaultState={false} style={{height: '6vh'}}/>
            </div>
            <div className='folder-list-selectable-divider' />
                <div className='folder-list-selectable-add-folder-container'>
                    <input type={'text'} placeholder="Create a new folder" className='folder-list-selectable-add-folder-input'/>
                    <button className='folder-list-selectable-add-folder-add-button'>+</button>
                </div>
        </div>
    );
}
 
export default FolderListSelectable;