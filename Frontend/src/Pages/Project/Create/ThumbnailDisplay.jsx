import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ThumbnailDisplay = ({thumbnail, removeThumbnail}) => {
    console.log("🚀 ~ file: ThumbnailDisplay.jsx ~ line 6 ~ ThumbnailDisplay ~ thumbnail", thumbnail)
    console.log("🚀 ~ file: ThumbnailDisplay.jsx ~ line 11 ~ useEffect ~ thumbnail.type", thumbnail.type)
    const [isHovered, setIsHovered] = useState(false)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (thumbnail?.type?.includes('image')) {
            var reader = new FileReader();
            reader.onload = function(){
                setImage(reader.result)
            };
            reader.readAsDataURL(thumbnail)
        } else {
            setImage(thumbnail)
        }
    }, []);

    if (!image) return <h1>Loading...</h1>
    return ( 
        <div
        onClick={removeThumbnail}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`overflow-hidden flex w-full h-full relative items-center justify-center ${isHovered && 'cursor-pointer'}`}
        >
            {isHovered && <div className="bg-red-500/50 absolute flex w-full h-full"></div>}
            {isHovered && <FontAwesomeIcon className="absolute text-4xl text-white" icon={faTrash} />}
            <img className="object-scale-down w-full h-full" src={ image } alt="Thumbnail"></img>
        </div>
     );
}
 
export default ThumbnailDisplay;