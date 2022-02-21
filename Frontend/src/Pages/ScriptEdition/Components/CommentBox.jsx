import {React, useState} from "react";

const CommentBox = ({comments}) => {

    const commentList = comments.map((comment) => {
        return (
            <li className="flex">
                <textarea name="replica-text" id="" 
                    // cols="40" rows="2"
                    defaultValue={comment}
                    className="p-3 w-full leading-7 text-l my-1
                    rounded-md border border-solid border-blue-800
                    bg-gray-200 resize-none
                    focus:text-black focus:border-blue-800 focus:outline-none"
                    ></textarea>
            </li>
        )
    });


    return (
        <ul className="w-full h-full list-none m-auto flex flex-col flex-nowrap pl-1">{commentList}</ul>
    )
}

export default CommentBox;