import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ThumbnailDisplay = ({thumbnail, removeThumbnail}) => {
    const [isHovered, setIsHovered] = useState(false)

    return ( 
        <div
        onClick={removeThumbnail}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`overflow-hidden flex w-full h-full relative items-center justify-center ${isHovered && 'cursor-pointer'}`}
        >
            {isHovered && <div className="bg-red-500/50 absolute flex w-full h-full"></div>}
            {isHovered && <FontAwesomeIcon className="absolute text-4xl text-white" icon={faTrash} />}
            <img className="object-scale-down w-full h-full" src={ thumbnail } alt="Thumbnail"></img>
        </div>
     );
}
 
export default ThumbnailDisplay;