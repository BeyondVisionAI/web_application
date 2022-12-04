import { useState, useEffect, useRef } from "react";
import "./ThumbnailEditable.css"
import { AiOutlineUpload } from "react-icons/ai";

const ThumbnailEditable = ({thumbnailUrl, editThumbnail, isEditable}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [thumbnail, setThumbnail] = useState(thumbnailUrl)
    const inputRef = useRef(null)

    useEffect(() => {
        setThumbnail(thumbnailUrl)
    }, [thumbnailUrl, isEditable]);

    const handleChange = (e) => {
        setThumbnail(URL.createObjectURL(e.target.files[0]))
        editThumbnail(e.target.files[0])
    }

    return (
        <>
            <img className="thumbnail-editable-image" src={thumbnail} alt="project" onMouseEnter={() => setIsHovered(true)}/>
            {isHovered && isEditable && <div className="thumbnail-editable-hover-container" onClick={() => inputRef?.current?.click()} onMouseLeave={() => setIsHovered(false)}>
                <AiOutlineUpload className="thumbnail-editable-hover-icon"/>
                <input onChange={handleChange} accept="image/*" type="file" name="thumbnail" id="thumbnail" ref={inputRef} style={{display: 'none'}}/>
            </div>}
        </>
    );
}
 
export default ThumbnailEditable;