import {React, useEffect, useState } from "react";
import CommentBox from './CommentBox';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReplicaDetails.css'


const ReplicaDetails = ({replica, updateReplica}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState(replica.content);
    const [comments, setComments] = useState([]);
    const [timestamp, setTimestamp] = useState(replica.timestamp);
    const [duration, setDuration] = useState(replica.duration);
    const [voiceSelected, setVoiceSelected] = useState(replica.voiceId);
    const [voiceOption, setVoiceOption] = useState([]);
    const [languageSelected, setLanguageSelected] = useState(0);
    const [languageOption, setLanguageOption] = useState(['Tous']);

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

    const voiceName = function(nameId, language) {
        if (languageOption[languageSelected] === "Tous")
            return (nameId + ' - ' + language);
        else
            return (nameId);
    }

    const handleLanguageChange = function(e) {
        setLanguageSelected(e.target.value);
    }

    const handleVoiceChange = function(e) {
        setVoiceSelected(e.target.value);
    }

    const changeVoiceSelected = function(voiceId) {
        if (voiceOption !== undefined && voiceOption.length > 0) {
            const index = voiceOption.findIndex(item => item.id == voiceId);
            if (index === -1) {
                setVoiceSelected(voiceOption[0].id);
            } else {
                setVoiceSelected(voiceId);
            }
        }
    }

    const updateReplicaText = async function () {
        try {
            const res = await axios({
                method: 'PUT',
                data: {
                    content: text,
                    timestamp: timestamp,
                    duration: duration,
                    voiceId: voiceSelected
                },
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}`,
                withCredentials: true
            });
            updateReplica(res.data)
            setIsLoading(false)
        } catch (err) {
            console.error("error => ", err);
        }
    }

    useEffect(async () => {
        const retrieveLanguages = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_IA_URL}/Voice/RetrieveLanguages`);
                const temp = ["Tous"]
                for (const language of response.data.language)
                    temp.push(language);
                setLanguageOption(temp);
            } catch (err) {
                console.error("Replica Error :", err);
            }
        }
        await retrieveLanguages();
        const retrieveVoices = async () => {
            try {
                let response = '';
                if (languageOption[languageSelected] === 'Tous')
                    response = await axios.get(`${process.env.REACT_APP_SERVER_IA_URL}/Voice/RetrieveVoices`);
                else
                    response = await axios.get(`${process.env.REACT_APP_SERVER_IA_URL}/Voice/RetrieveVoices`, { params: { language: languageOption[languageSelected] }});
                const voices = response.data.voices;
                setVoiceOption(voices);
                changeVoiceSelected(voiceSelected);
            } catch (err) {
                console.error("Replica Error :", err);
            }
        }
        await retrieveVoices();
    }, [languageSelected]);

    useEffect(() => {
        replicaTextUpdateTimeout = setTimeout(updateReplicaText, 5000);

        return () => {
            clearTimeout(replicaTextUpdateTimeout);
        }
    }, [isTextUpdated]);

    useEffect(() => {
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
                            case "USER_NOT_LOGIN":
                                errMsg = "Error (401) - User is not logged in.";
                                break;
                            /* errors that fits the 403 to me */
                            case "PROJECT_NOT_YOURS":
                                errMsg = "Error (401) - No collaboration found between the userId and the project.";
                                break;
                            default:
                                errMsg = "Error (401).";
                                break;
                        }
                        break;
                    case 403:
                        errMsg = "Error (403) - User has no right to access the content.";
                        break;
                    case 404:
                        switch (e.response.data) {
                            case "PROJECT_NOT_FOUND":
                                errMsg = "Error (404) - Missing project.";
                                break;
                            case "REPLICA_NOT_FOUND":
                                errMsg = "Error (404) - Missing replica.";
                                break;
                            case "REPLICA_NOT_IN_PROJECT":
                                errMsg = "Error (404) - Invalid replica, does not belong to the project.";
                                break;
                            default:
                                errMsg = "Error (404).";
                                break;
                        }
                        break;
                    default /* 500 */
                    :
                        errMsg = "Internal Error.";
                        break;
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
        changeVoiceSelected(replica.voiceId)
        setLastEdit(replica.lastEditDate);
        setLastEditor(replica.lastEditor);
    }, [replica]);

    /***
     * COMMENT UPDATE
     */

    const updateComments = (newComment) => {
        var newComments = [...comments]
        if (newComments.findIndex((item) => item._id === newComment._id) !== -1) {
            newComments[newComments.findIndex((item) => item._id === newComment._id)] = newComment;
        } else {
            newComments.push(newComment)
        }
        setComments(newComments)
    }

    const removeComment = (commentID) => {
        var newComments = [...comments]
        newComments.splice(newComments.findIndex((item) => item._id === commentID), 1)
        setComments(newComments)
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

            if (hours === 0)
                return mStr + ':' + sStr + ':' + msStr;
            return hStr + ':' + mStr + ':' + sStr + ':' + msStr;
        }

        return msToTimecode(parseInt(t));
        // var start = msToTimecode(parseInt(t));
        // var end = msToTimecode(parseInt(t) + d);

        // return "[" + start + "] - [" + end + "] (" + d / 1000 + "s)";
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
        var fName = person?.firstName;
        if (fName) {
            return `${fName.charAt(0).toUpperCase() + fName.slice(1)} .${person.lastName.charAt(0).toUpperCase()}`;
        } else {
            return ("you")
        }
    }

    return (
        <div className="h-full w-full flex flex-col justify-around py-2 px-6">
            {/* Titre */}
            <h1 className="text-blue-400 text-2xl text-center">Paramètres de la réplique</h1>

            {/* Texte */}
            <div>
                <div className="w-full flex flex-row justify-between items-center">
                    <h3 className="section-title">Texte :</h3>
                    <h3>-/100</h3>
                </div>
                <textarea name="replica-text" id=""
                          value={text} maxLength='100' rows={3}
                          onChange={handleReplicaTextChange}
                          className="w-full resize-none px-2 py-1 text-base
                    rounded-md border border-solid border-blue-500
                    focus:text-black focus:bg-white focus:border-blue-500 focus:outline-none"
                ></textarea>
            </div>

            {/* Voix */}
            <div>
                <div className="w-full flex flex-row justify-between items-center mb-1">
                    <h3 className="section-title">Voix language :</h3>
                    <select name="languageSelection" id="languageSelection"
                            value= {languageSelected}
                            className="inline-flex items-center form-select form-select-lg
                            w-2/5 p-2 mr-9
                            text-xl
                            border border-solid border-blue-300 rounded
                            transition ease-in-out
                            focus:text-black focus:bg-white focus:border-blue-300 focus:outline-none"
                            onChange={handleLanguageChange}>
                        {languageOption.map(((value, index) => (
                            <option key={index} value={index}>
                                {value}
                            </option>
                        )))}
                    </select>
                </div>
                <div className="w-full flex flex-row justify-between items-center mb-1">
                    <h3 className="section-title">Voix :</h3>
                    <select name="voiceSelection" id="voiceSelection"
                            value= {voiceSelected}
                            className="inline-flex items-center form-select form-select-lg
                            w-2/5 p-2 mr-9
                            text-xl
                            border border-solid border-blue-300 rounded
                            transition ease-in-out
                            focus:text-black focus:bg-white focus:border-blue-300 focus:outline-none"
                            onChange={handleVoiceChange}>
                        {voiceOption.map((
                            (option, index) => (
                                <option key={index} value={option.id}>
                                    {voiceName(option.nameID, option.language)}
                                </option>
                            )
                        ))}
                    </select>
                </div>

                {/* Starting time */}
                <div className="w-full flex flex-row justify-between items-center mt-1">
                    <h3 className="section-title">Commence à :</h3>
                    <input type='text' defaultValue={formatTimestamp(timestamp, duration)} disabled={true}
                           className="inline-flex items-center
                        w-1/2 p-2 text-base
                        border border-solid border-blue-300 rounded">
                    </input>
                </div>
            </div>

            <div className="w-full flex flex-row justify-between items-center">
                <h3 className="section-title">Commentaires:</h3>
                <h3>{ comments.length }</h3>
            </div>
            <div id="comment-frame" className="wrapper">
                <CommentBox comments={comments} replica=languageSelected{replica} updateComments={updateComments} removeComment={removeComment}/>
            </div>
            <button
                onClick={() => {setIsLoading(true);updateReplicaText()}}
                className="bg-myBlue w-1/8 h-1/8 rounded-full text-white truncate p-3 items-center text-base mb-2">{isLoading ? "Saving..." : "Save"}</button>

            {/* <div className="w-full h-5 mb-0 px-1 align-center bg-gray-300 flex flex-row justify-between">
                <p className="inline-flex text-xs text-left text-gray-400 align-bottom hover:align-top truncate">{formatTimestamp(timestamp, duration)}</p>
                <p className="inline-flex text-xs text-right text-gray-400 align-bottom hover:align-top truncate">{formatDate(lastEdit)} by {formatLastEditor(lastEditor)}</p>
            </div> */}
        </div>
    )

    /*
        return (
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
            <CommentBox comments={comments} replica={replica} updateComments={updateComments} removeComment={removeComment}/>
        </div>
        <button
        onClick={() => {setIsLoading(true);updateReplicaText()}}
        className="bg-myBlue w-1/8 h-1/8 rounded-full text-white truncate p-3 items-center text-base mb-2">{isLoading ? "Saving..." : "Save"}</button>

        <div className="w-full h-5 mb-0 px-1 align-center bg-gray-300 flex flex-row justify-between">
            <p className="inline-flex text-xs text-left text-gray-400 align-bottom hover:align-top truncate">{formatTimestamp(timestamp, duration)}</p>
            <p className="inline-flex text-xs text-right text-gray-400 align-bottom hover:align-top truncate">{formatDate(lastEdit)} by {formatLastEditor(lastEditor)}</p>
        </div>
    </div>
)
            */
}

export default ReplicaDetails;