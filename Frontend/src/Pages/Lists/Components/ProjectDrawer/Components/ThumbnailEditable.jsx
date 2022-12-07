import { useState, useEffect, useRef } from "react";
import "./ThumbnailEditable.css"
import { AiOutlineUpload } from "react-icons/ai";

const ThumbnailEditable = ({thumbnailUrl, editThumbnail, isEditable}) => {
    const [thumbnail, setThumbnail] = useState(thumbnailUrl)
    const inputRef = useRef(null)

    useEffect(() => {
        if (typeof thumbnailUrl === 'object') {
            setThumbnail(URL.createObjectURL(thumbnailUrl))
        } else {
            setThumbnail(thumbnailUrl)
        }
    }, [thumbnailUrl]);

    const handleChange = (e) => {
        editThumbnail(e.target.files[0])
    }

    return (
        <>
            <img className="thumbnail-editable-image" src={thumbnail} alt="project"/>
            {isEditable && <div className="thumbnail-editable-hover-container" onClick={() => inputRef?.current?.click()} >
                <AiOutlineUpload className="thumbnail-editable-hover-icon"/>
                <input onChange={handleChange} accept="image/*" type="file" name="thumbnail" id="thumbnail" ref={inputRef} style={{display: 'none'}}/>
            </div>}
        </>
    );
}
 
export default ThumbnailEditable;