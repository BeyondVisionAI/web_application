import {React, useEffect, useState } from "react";
import CommentBox from './CommentBox';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReplicaDetails = ({replica, updateReplicaContent, updateReplicaSelected}) => {
    const [text, setText] = useState(replica.content);
    const [comments, setComments] = useState([]);
    const [timestamp, setTimestamp] = useState(replica.timestamp);
    const [duration, setDuration] = useState(replica.duration);
    const [voiceId, setVoiceId] = useState(replica.voiceId);

    // additional infos 
    const [lastEdit, setLastEdit] = useState(replica.lastEditDate);
    const [lastEditor, setLastEditor] = useState(replica.lastEditor);
    const [characterCount, setCharacterCount] = useState("" + replica.content.length + "/100");

    const [isTextUpdated, toggleTextUpdate] = useState(false);
    let replicaTextUpdateTimeout = null;

    /***
     * TEXT AND REPLICA UPDATE
     */

    const handleReplicaTextChange = async function (event) {
        setCharacterCount(`${event.target.value.length}/100`);
        setText(event.target.value);
        toggleTextUpdate(!isTextUpdated)
    }

    useEffect(() => {
        const updateReplicaText = async function () {
            try {
                const res = await axios({
                    method: 'PUT',
                    data: {
                        content: text,
                        timestamp: timestamp,
                        duration: duration,
                        voiceId: voiceId
                    },
                    url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}`,
                    withCredentials: true
                });
                updateReplicaContent(replica._id, text);
            } catch (e) {
                let errMsg = "Error";
                switch (e.response.status) {
                    case 401:
                        switch (e.response.data) {
                            case "USER_NOT_LOGIN": errMsg = "Error (401) - User is not logged in."; break;
                            /* errors that fits the 403 to me */
                            case "PROJECT_NOT_YOURS": errMsg = "Error (401) - No collaboration found between the userId and the project."; break;
                            default: errMsg = "Error (401)."; break;
                        } break;
                    case 403: errMsg = "Error (403) - User has no right to access the content."; break;
                    case 404:
                        switch (e.response.data) {
                            case "PROJECT_NOT_FOUND": errMsg = "Error (404) - Missing project."; break;
                            case "REPLICA_NOT_FOUND": errMsg = "Error (404) - Missing replica."; break;
                            case "REPLICA_NOT_IN_PROJECT": errMsg = "Error (404) - Invalid replica, does not belong to the project."; break;
                            default: errMsg = "Error (404)."; break;
                        } break;
                    default /* 500 */ : errMsg = "Internal Error."; break;
                }
                toast.error(errMsg);
                console.error(e);
            }
        }

        replicaTextUpdateTimeout = setTimeout(updateReplicaText, 5000);

        return () => {
            clearTimeout(replicaTextUpdateTimeout);
        }
    }, [isTextUpdated]);

    useEffect(() => {
        // TODO :: this is not cool since it does a backend call each time u move the timestamp
        const fetchReplicaComments = async () => {
            try {
                const res = await axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments`,
                    withCredentials: true
                });
                let resComm = Object.values(res.data);
                setComments(resComm);
            } catch (e) {
                let errMsg = "Error";
                switch (e.response.status) {
                    case 401:
                        switch (e.response.data) {
                            case "USER_NOT_LOGIN": errMsg = "Error (401) - User is not logged in."; break;
                            /* errors that fits the 403 to me */
                            case "PROJECT_NOT_YOURS": errMsg = "Error (401) - No collaboration found between the userId and the project."; break;
                            default: errMsg = "Error (401)."; break;
                        } break;
                    case 403: errMsg = "Error (403) - User has no right to access the content."; break;
                    case 404:
                        switch (e.response.data) {
                            case "PROJECT_NOT_FOUND": errMsg = "Error (404) - Missing project."; break;
                            case "REPLICA_NOT_FOUND": errMsg = "Error (404) - Missing replica."; break;
                            case "REPLICA_NOT_IN_PROJECT": errMsg = "Error (404) - Invalid replica, does not belong to the project."; break;
                            default: errMsg = "Error (404)."; break;
                        } break;
                    default /* 500 */ : errMsg = "Internal Error."; break;
                }
                toast.error(errMsg);
                console.error(e);
            }
        }

        fetchReplicaComments();
        setText(replica.content);
        setCharacterCount(`${replica.content.length}/100`);
        setTimestamp(replica.timestamp);
        setDuration(replica.duration);
        setVoiceId(replica.voiceId);
        setLastEdit(replica.lastEditDate);
        setLastEditor(replica.lastEditor);
    }, [replica, updateReplicaSelected]);


    /***
     * COMMENT UPDATE
     */


    const addComment = (comment) => setComments([...comments, comment]);

    const removeComment = function (commentId) {
        var commentListCopy = [...comments];
        commentListCopy.splice(commentListCopy.findIndex(item => item._id === commentId), 1);
        setComments(commentListCopy);
    }

    /***
     * FORMATTING FUNCTIONS
     */

    const formatTimestamp = function (t, d) {
        const msToTimecode = function(t) {
            var hours = Math.floor(t / 3600000);
            var minutes = Math.floor((t - (hours * 3600000)) / 60000);
            var seconds = Math.floor((t - (hours * 3600000) - (minutes * 60000)) / 1000);
            var ms = t - (hours * 3600000) - (minutes * 60000) - (seconds * 1000);
        
            var hStr = hours < 10 ? "0"+hours : ""+hours;
            var mStr = minutes < 10 ? "0"+minutes : ""+minutes;
            var sStr = seconds < 10 ? "0"+seconds : ""+seconds;
            var msStr= ms >= 100 ? ""+ms : ms >= 10 ? "0"+ms : "00"+ms;
            
            if (hours == 0)
                return mStr + ':' + sStr + ':' + msStr;
            return hStr + ':' + mStr + ':' + sStr + ':' + msStr;
        }

        var start = msToTimecode(t);
        var end = msToTimecode(t + d);

        return "[" + start + "] - [" + end + "] (" + d / 1000 + "s)";
    }


    const formatDate = function(time) {
        const dateOptions =
        {
            weekday: 'short', year: 'numeric', month: '2-digit',
            day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        return new Date(time).toLocaleDateString("fr-FR", dateOptions);
    }


    const formatLastEditor = function(person) {
        var fName = person.firstName;
        return `${fName.charAt(0).toUpperCase() + fName.slice(1)} .${person.lastName.charAt(0).toUpperCase()}`;
    }

    return (
        <>
        <div className="h-full w-full flex flex-col justify-around">
            <h1 className="text-blue-400 text-2xl text-center">Détails</h1>
            <div className="w-full flex flex-row justify-between items-center pl-2">
                <h3 className="ml-2 text-xl inline-flex items-center">Texte</h3>
                <h3 className="inline-flex items-center text-l mr-9">{characterCount}</h3>
            </div>
            <textarea name="replica-text" id="" 
            value={text} maxLength='100'
            onChange={handleReplicaTextChange}
            className="w-11/12 resize-none my-2 ml-4 px-2 py-1 leading-7 text-xl
            rounded-md border border-solid border-blue-500
            focus:text-black focus:bg-white focus:border-blue-500 focus:outline-none"
            ></textarea>

            <div className="w-full flex flex-row justify-between items-center pl-2">
                <h3 className="ml-2 text-xl inline-flex items-center">Voix</h3>
                <select name="voiceSelection" id="" selected={voiceId}
                className="inline-flex items-center form-select form-select-lg
                w-2/5 p-2 mr-9
                text-xl 
                border border-solid border-blue-300 rounded
                transition ease-in-out
                focus:text-black focus:bg-white focus:border-blue-300 focus:outline-none">
                    <option value="toto">toto</option>
                    <option value="plop">plop</option>
                    <option value="foo">foo</option>
                    <option value="bar">bar</option>
                    <option value="addVoice">Ajouter une voix</option>
                </select>
            </div>

            <h3 className="pl-4 text-xl">Commentaires</h3>
            <div id="comment-frame" className="w-fit h-3/6 ml-6 mr-9 overflow-y-auto">
                <CommentBox comments={comments} replica={replica} addComment={addComment} removeComment={removeComment} />
            </div>

            <div className="w-full h-5 mb-0 px-1 align-center bg-gray-300 flex flex-row justify-between">
                <p className="inline-flex text-xs text-left text-gray-400 align-bottom hover:align-top">{formatTimestamp(timestamp, duration)}</p>
                <p className="inline-flex text-xs text-right text-gray-400 align-bottom hover:align-top">{formatDate(lastEdit)} by {formatLastEditor(lastEditor)}</p>
            </div>
        </div>
        </>
    )
}

export default ReplicaDetails;