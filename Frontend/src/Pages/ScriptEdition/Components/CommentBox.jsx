import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

const CommentBox = ({comments, replica, updateComments, removeComment}) => {
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.scripEdition.replicaComment'});
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
            toast.error(tErr("postComment"));
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
            toast.error(tErr("removeComment"));
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