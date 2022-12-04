import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

const grabbable =  {
    cursor: 'move',
    cursor: 'grab', // eslint-disable-line
    cursor: '-moz-grab', // eslint-disable-line
    cursor: '-webkit-grab', // eslint-disable-line
}

const grabbableActive = {
    cursor: 'grabbing',
    cursor: '-moz-grabbing', // eslint-disable-line
    cursor: '-webkit-grabbing', // eslint-disable-line
}

const TimelineCursor = ({secondsPlayed, secondToPixelRatio, setNewSecondsFromCursor, onTimelineSeek}) => {
    const [position, setPosition] = useState({x: secondsPlayed * secondToPixelRatio, y: 0})
    const [cursorStyle, setCursorStyle] = useState(grabbable)
    const cursorRef = useRef(null)

    useEffect(() => {
        setPosition({x: secondsPlayed * secondToPixelRatio, y: 0})
    }, [secondToPixelRatio, secondsPlayed]);

    useEffect(() => {
        cursorRef?.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    }, [position]);

    const onDragStart = () => {
        setCursorStyle(grabbableActive)
    }

    const onDragStop = (event, data) => {
        setPosition({x: data.x, y: 0})
        setNewSecondsFromCursor(data.x / secondToPixelRatio)
        setCursorStyle(grabbable)
    }

    return (
        <Draggable
        axis="x"
        onStart={onDragStart}
        onStop={onDragStop}
        position={position}
        >
            <div ref={cursorRef} className='absolute w-1 h-full bg-myBlue' style={{...cursorStyle}}>
            </div>
        </Draggable>
    )

    // return (
    //     <div ref={cursorRef} className='absolute w-2 h-full bg-red-600' style={{left: leftOffset}}>
    //     </div>
    // );
}
 
export default TimelineCursor;