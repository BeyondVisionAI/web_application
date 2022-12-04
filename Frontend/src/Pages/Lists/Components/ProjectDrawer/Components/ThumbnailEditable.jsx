import { useState, useEffect, useRef } from "react";
import "./ThumbnailEditable.css"
import { AiOutlineUpload } from "react-icons/ai";

const ThumbnailEditable = ({thumbnailUrl, editThumbnail, isEditable}) => {
    const [isHovered, setIsHovered] = useState(false)
    const inputRef = useRef(null)

    const handleChange = (e) => {
        console.log("VALUE", e);
    }

    return (
        <>
            <img className="thumbnail-editable-image" src={thumbnailUrl} alt="project" onMouseEnter={() => setIsHovered(true)}/>
            {isHovered && isEditable && <div className="thumbnail-editable-hover-container" onClick={() => inputRef?.current?.click()} onMouseLeave={() => setIsHovered(false)}>
                <AiOutlineUpload className="thumbnail-editable-hover-icon"/>
                <input onError={(e) => console.log(e)} onChange={(e) => console.log("a")} accept="image/*" type="file" name="thumbnail" id="thumbnail" ref={inputRef} style={{display: 'none'}}/>
            </div>}
        </>
    );
}
 
export default ThumbnailEditable;