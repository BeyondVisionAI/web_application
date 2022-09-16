import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import Tooltip from '@mui/material/Tooltip';

const CommentBox = ({comments, replica, updateComments, removeComment}) => {

    const [newComment, setNewComment] = useState("");
    const [contextSelectedCommentId, setContextSelectedCommentId] = useState(null);
    const bottomOfMessageRef = useRef(null);

    /***
     * FORMAT FUNCTIONS
     */

     const formatAuthor = function(person) {
        var fName = person?.firstName;
        if (fName) {
            return `${fName.charAt(0).toUpperCase() + fName.slice(1)} .${person.lastName.charAt(0).toUpperCase()}`;
        } else {
            return ("you")
        }
    }

    const formatDate = function(time) {
        const dateOptions =
        {
            year: 'numeric', month: '2-digit',
            day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        return new Date(time).toLocaleDateString("fr-FR", dateOptions);
    }


    const commentList = React.useMemo(() => comments.map((comment, index) => {
        return (
            <ContextMenuTrigger id="comment_ctm" key={index}>
                <Tooltip title={`Écrit par ${formatAuthor(comment.author)} le ${formatDate(comment.date)}`}>
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
                </Tooltip>
            </ContextMenuTrigger>
        )
    }), [comments]);

    useEffect(() => {
        bottomOfMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const postComment = async function (e) {
        e.preventDefault();
        try {
            let body = {content: newComment};
            const commentResponse = await axios({
                method: 'POST',
                data: body,
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments/`,
                withCredentials: true
            });
            updateComments(commentResponse.data);
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


    const deleteComment = async function () {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments/${contextSelectedCommentId}`,
                withCredentials: true
            });

            removeComment(contextSelectedCommentId);
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

            toast.error(errLog);
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
                <div style={{ float:"left", clear: "both" }}
                    ref={bottomOfMessageRef}>
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