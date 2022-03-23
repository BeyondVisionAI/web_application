import {React, useState} from "react";
import axios from 'axios';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';

const CommentBox = ({comments, replica, updateComments}) => {

    const [newComment, setNewComment] = useState("");
    const [contextSelectedCommentId, setContextSelectedCommentId] = useState(null);

    const commentList = comments.map((comment, index) => {
        return (
            <ContextMenuTrigger id="comment_ctm" key={index}>
                <li className="flex">
                    <div className="p-3 w-full h-auto
                    my-1
                    rounded-md border border-solid border-blue-800
                    bg-gray-200"
                    onContextMenu={() => setContextSelectedCommentId(comment._id)}>
                        <p className="leading-7 text-l">
                            {comment.content}
                        </p>
                    </div>
                </li>
            </ContextMenuTrigger>
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
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments/`,
                withCredentials: true
            });

            console.log(commentResponse);
            await updateComments();
        } catch (e) {
            console.error(e);
        }
        setNewComment("");
    }


    const deleteComment = async function () {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments/${contextSelectedCommentId}`,
                withCredentials: true
            });

            await updateComments();
        } catch (err) {
            let errLog;

            switch (err.response.status) {
                case 401:
                    switch (err.response.data) {
                        case "USER_NOT_LOGIN":
                            errLog = `Error (${err.response.status}) - User not logged in.`;
                            break;
                        case "PROJECT_NOT_YOURS":
                            errLog = `Error (${err.response.status}) - You are not the owner of this project.`;
                            break;
                        case "ROLE_UNAUTHORIZED":
                            errLog = `Error (${err.response.status}) - Invalid rights.`;
                            break;
                        default: errLog = `Error (${err.response.status}).`;
                            break;
                    }
                    break;
                case 403:
                    errLog = `Error (${err.response.status}).`;
                    break;
                case 404:
                    switch (err.reponse.data) {
                        case "PROJECT_NOT_FOUND":
                            errLog = `Error (${err.response.status}) - Project not found.`;
                            break;
                        case "REPLICACOMMENT_NOT_FOUND":
                            errLog = `Error (${err.response.status}) - Replica Comment not found.`;
                            break;
                        default:
                            errLog = `Error (${err.response.status}).`;
                            break;
                    }
                default/*500*/: errLog = `Error (${err.response.status}) - Internal Error.`; break;
            }
        }
    }


    return (
        <>
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


            <ContextMenu id="comment_ctm">
                <MenuItem onClick={deleteComment}>
                    Supprimer ...
                </MenuItem>
            </ContextMenu>
        </>
    )
}

export default CommentBox;