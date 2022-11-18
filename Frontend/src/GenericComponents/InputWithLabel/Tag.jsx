import React from "react";

function Tag({ text, onDelete }) {
    return (
        <div className="px-0.5 transition ease-in-out hover:scale-110">
            <div className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-myBlue rounded-full">
                <label>{text}</label>
                <button className="pl-2 text-myBlack text-base" onClick={() => onDelete()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    );
}

export default Tag;