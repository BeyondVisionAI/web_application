import {React, useEffect, useState } from "react";
import CommentBox from './CommentBox';
import axios from 'axios';
import { toast } from 'react-toastify';

const dateOptions =
{
    weekday: 'short', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
};

const ReplicaDetails = ({replica, updateReplicaList}) => {
    const [text, setText] = useState(replica.content);
    const [comments, setComments] = useState([]);
    const [timestamp, setTimestamp] = useState(replica.timestamp);
    const [duration, setDuration] = useState(replica.duration);
    const [voiceId, setVoiceId] = useState(replica.voiceId);

    // additional infos 
    const [lastEdit, setLastEdit] = useState(replica.lastEdit);
    const [lastEditor, setLastEditor] = useState(replica.lastEditor);
    const [characterCount, setCharacterCount] = useState("" + replica.content.length + "/100");

    const formatted_date = new Date(lastEdit).toLocaleDateString("fr-FR", dateOptions);

    const [isTextUpdated, toggleTextUpdate] = useState(false);
    let replicaTextUpdateTimeout = null;

    // useEffect(() => {
    //     replicaTextUpdateTimeout = setTimeout(console.log("tptp"), 500);
    // }, [isTextUpdated]);

    const handleReplicaTextChange = async function (event) {
        setCharacterCount(`${event.target.value.length}/100`);
        setText(event.target.value);
        toggleTextUpdate(!isTextUpdated)
    }

    useEffect(() => {
        const updateReplicaText = async function () {
            console.log("sending the update request");
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
                updateReplicaList();
            } catch (err) {
                console.error("error => ", err);
            }
        }

        replicaTextUpdateTimeout = setTimeout(updateReplicaText, 5000);

        return () => {
            clearTimeout(replicaTextUpdateTimeout);
        }
    }, [isTextUpdated]);


//     useEffect(() => {
//         const updateReplicaText = async function () {
//             try {
//                 const res = await axios({
//                     method: 'PUT',
//                     data: {
//                         content: text,
//                         timestamp: timestamp,
//                         duration: duration,
//                         voiceId: voiceId
//                     },
//                     url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}`,
//                     withCredentials: true
//                 });
//             } catch (err) {
//                 console.error("error => ", err);
//             }
//         }

//         updateReplicaText();
// }, [text]);

    const updateReplicaComments = async () => {
        try {
            const res = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments`,
                withCredentials: true
            });
            console.log(`/projects/${replica.projectId}/replicas/${replica._id}/comments`);
            console.log(res);
            let resComm = Object.values(res.data);
            console.log(resComm);
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

    useEffect(() => {
        const fetchReplicaComments = async () => {
            try {
                const res = await axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments`,
                    withCredentials: true
                });
                console.log(`/projects/${replica.projectId}/replicas/${replica._id}/comments`);
                console.log(res);
                let resComm = Object.values(res.data);
                console.log(resComm);
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
        setLastEdit(replica.lastEdit);
        setLastEditor(replica.lastEditor);
    }, [replica]);


    return (
        <>
        <div className="h-full w-full flex flex-col justify-around">
            <h1 className="text-blue-400 text-2xl text-center">Détails</h1>
            <div className="w-full flex flex-row justify-between items-center pl-2">
                <h3 className="ml-2 text-xl inline-flex items-center">Texte</h3>
                <h3 className="inline-flex items-center text-l mr-9">{characterCount}</h3>
            </div>
            <textarea name="replica-text" id="" 
            // cols="40" rows="2"
            value={text} maxLength='100'
            // defaultValue={text} maxLength='100'
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
            <div id="comment-frame" className="w-fit h-3/6 bg-red-200 ml-6 mr-9 overflow-y-auto">
                <CommentBox comments={comments} replica={replica} updateComments={updateReplicaComments} />
            </div>

            <div className="w-full align-bottom bg-gray-300">
                <p className="text-right text-gray-400 align-bottom hover:align-top">Dernier changement le {formatted_date} par {lastEditor}</p>
            </div>
        </div>
        </>
        )
}

export default ReplicaDetails;