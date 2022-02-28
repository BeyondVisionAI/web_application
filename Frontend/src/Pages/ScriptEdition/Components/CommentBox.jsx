import {React, useState} from "react";
import axios from 'axios';

const CommentBox = ({comments}) => {

    const [newComment, setNewComment] = useState("");

    const handleNewCommentChange = (value) => {
        setNewComment(value);
    }

    const commentList = comments.map((comment, index) => {
        return (
            <li className="flex" key={index}>
                <div className="p-3 w-full h-auto
                my-1
                rounded-md border border-solid border-blue-800
                bg-gray-200">
                    <p className="leading-7 text-l">
                        {comment}
                    </p>
                </div>
            </li>


            // Textarea cards
            // <li className="flex">
            //     <textarea name="replica-text" id="" 
            //         // cols="40" rows="2"
            //         defaultValue={comment}
            //         className="p-3 w-full h-auto leading-7 text-l my-1
            //         rounded-md border border-solid border-blue-800
            //         bg-gray-200 resize-none
            //         focus:text-black focus:border-blue-800 focus:outline-none"
            //         ></textarea>
            // </li>
        )
    });

    const postComment = async function (e) {
        e.preventDefault();
        console.log("New comment : " + newComment);
        // try {
        //     let jsonObj = {projectId: "something", date: Date.now(), comment: newComment};
        //     let commentResponse = await axios.post(`${process.env.REACT_APP_API_URL}/comment`, jsonObj);

        //     console.log(commentResponse);
        // } catch (e) {
        //     console.error(e);
        // }
        setNewComment("");
    }

    return (
        <form onSubmit={postComment}>
            <ul className="w-full h-full list-none m-auto flex flex-col flex-nowrap pl-1">{commentList}</ul>
            <div className="w-full h-auto pl-1">
                <input type="text" placeholder="Écrivez votre nouveau commentaire"
                    onChange={e => setNewComment(e.target.value)}
                    value={newComment}
                    className="p-3 w-full h-auto leading-7 text-l my-1
                    rounded-md border border-solid border-blue-800
                    bg-gray-200 resize-none
                    focus:text-black focus:border-blue-800 focus:outline-none" />
            </div>
        </form>
    )
}

export default CommentBox;