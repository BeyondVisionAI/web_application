import {React, useState} from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const CommentBox = ({comments, replica, updateComments}) => {

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
                        {comment.content}
                    </p>
                </div>
            </li>
        )
    });

    const postComment = async function (e) {
        e.preventDefault();
        console.log("New comment : " + newComment);
        try {
            let body = {content: newComment};
            const commentResponse = await axios({
                method: 'POST',
                data: body,
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments`,
                withCredentials: true
            });

            console.log(commentResponse);
            await updateComments();
        } catch (e) {
            let errMsg = "Error";
            switch (e.response.status) {
                case 401:
                    switch (e.response.data) {
                        case "USER_NOT_LOGIN": errMsg = "Error (401) - User is not logged in."; break;
                        /* errors that fits the 403 to me */
                        case "PROJECT_NOT_YOURS": errMsg = "Error (401) - No collaboration found between the userId and the project."; break;
                        case "ROLE_UNAUTHORIZED": errMsg = "Error (401) - Your rights are invalid for requested operation."; break;
                        default: errMsg = "Error (401)."; break;
                    } break;
                case 403: errMsg = "Error (403) - User has no right to access the content."; break;
                case 404:
                    switch (e.response.data) {
                        case "PROJECT_NOT_FOUND": errMsg = "Error (404) - Missing project."; break;
                        case "REPLICA_NOT_FOUND": errMsg = "Error (404) - Missing replica."; break;
                        default: errMsg = "Error (404)."; break;
                    } break;
                default /* 500 */ : errMsg = "Internal Error."; break;
            }
            toast.error(errMsg);
            console.error(e);
        }
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