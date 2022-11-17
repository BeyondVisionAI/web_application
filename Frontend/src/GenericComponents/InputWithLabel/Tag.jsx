import React from "react";

function Tag({ text, onDelete }) {
    return (
        <div className="px-0.5 transition ease-in-out hover:scale-110">
            <div className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-myBlue rounded-full">
                <label>{text}</label>
                <button className="pl-1 pb-0.5 text-myBlack text-base" onClick={() => onDelete()}>x</button>
            </div>
        </div>
    );
}

export default Tag;