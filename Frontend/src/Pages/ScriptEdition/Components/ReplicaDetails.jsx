import {React, useEffect, useState } from "react";
import CommentBox from './CommentBox';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReplicaDetails.css'
import VoiceChoices from "./VoicesChoice";
import { useTranslation } from 'react-i18next';

const ReplicaDetails = ({ replica, updateReplica }) => {
    const { t } = useTranslation('translation', {keyPrefix: 'scriptEdition'});
    const { tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.scriptEdition'});
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState(replica.content);
    const [comments, setComments] = useState([]);
    const [timestamp, setTimestamp] = useState(replica.timestamp);
    const [duration, setDuration] = useState(replica.duration);
    const [replicaId, setReplicaId] = useState(replica.id);
    const [voiceIdSelected, setVoiceIdSelected] = useState(replica.voiceId);

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

    const updateReplicaText = async function () {
        try {
            const res = await axios({
                method: 'PUT',
                data: {
                    content: text,
                    timestamp: timestamp,
                    duration: duration,
                    voiceId: voiceIdSelected
                },
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}`,
                withCredentials: true
            });
            updateReplica(res.data)
            setIsLoading(false)
        } catch (err) {
            toast.error(tErr("replica.updateReplica"));
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
                let resComm = Object.values(res.data);
                setComments(resComm);
            } catch (e) {
                toast.error(tErr("replicaComment.fetchAllReplicaComments"));
            }
        }
        fetchReplicaComments();
        setText(replica.content);
        setCharacterCount(`${replica.content.length}/100`);
        setTimestamp(replica.timestamp);
        setDuration(replica.duration);
        setVoiceIdSelected(replica.voiceId);
        setReplicaId(replica._id);
        setLastEdit(replica.lastEditDate);
        setLastEditor(replica.lastEditor);
    }, [replica]);

    /***
     * COMMENT UPDATE
     */
    const updateComments = (newComment) => {
        var newComments = [...comments];
        if (newComments.findIndex((item) => item._id === newComment._id) !== -1) {
            newComments[newComments.findIndex((item) => item._id === newComment._id)] = newComment;
        } else {
            newComments.push(newComment);
        }
        setComments(newComments);
    }

    const removeComment = (commentID) => {
        var newComments = [...comments];
        newComments.splice(newComments.findIndex((item) => item._id === commentID), 1);
        setComments(newComments);
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
            return (t('replicaDetails.you'))
        }
    }

    return (
        <div className="h-full w-full flex flex-col justify-around py-2 px-6">
            {/* Titre */}
            <h1 className="text-blue-400 text-2xl text-center">{t('replicaDetails.title')}</h1>

            {/* Texte */}
            <div>
                <div className="w-full flex flex-row justify-between items-center">
                    <h3 className="section-title">{t('replicaDetails.text.label')}</h3>
                    <h3>{t('replicaDetails.text.detail')}</h3>
                </div>
                <textarea name="replica-text"
                          value={ text } maxLength='100' rows={3}
                          onChange={ handleReplicaTextChange }
                          className="w-full resize-none px-2 py-1 text-base
                    rounded-md border border-solid border-blue-500
                    focus:text-black focus:bg-white focus:border-blue-500 focus:outline-none"
                ></textarea>
            </div>

            {/* Voix */}
            <div>
                <VoiceChoices voiceId={ voiceIdSelected } setVoiceIdSelected={ setVoiceIdSelected } replicaId={ replicaId }/>
                {/*<h3 className="section-title">{t('replicaDetails.voice.label')}</h3>*/}
                {/* Starting time */}
                <div className="w-full flex flex-row justify-between items-center mt-1">
                    <h3 className="section-title">{t('replicaDetails.startingTime.label')}</h3>
                    <input type='text' defaultValue={ formatTimestamp(timestamp, duration) } disabled={true}
                           className="inline-flex items-center
                            w-1/2 p-2 text-base
                            border border-solid border-blue-300 rounded">
                    </input>
                </div>
            </div>

            <div className="w-full flex flex-row justify-between items-center">
                <h3 className="section-title">{t('replicaDetails.comments.label')}</h3>
                <h3>{ comments.length }</h3>
            </div>
            <div id="comment-frame" className="wrapper">
                <CommentBox comments={ comments } replica={ replica } updateComments={ updateComments } removeComment={ removeComment }/>
            </div>
            <button
                onClick={ () => {setIsLoading(true);updateReplicaText()} }
                className="bg-myBlue w-1/8 h-1/8 rounded-full text-white truncate p-3 items-center text-base mb-2">{ isLoading ? "Saving..." : "Save" }</button>

            <div className="w-full h-5 mb-0 px-1 align-center bg-gray-300 flex flex-row justify-between">
                <p className="inline-flex text-xs text-left text-gray-400 align-bottom hover:align-top truncate">{ formatTimestamp(timestamp, duration) }</p>
                <p className="inline-flex text-xs text-right text-gray-400 align-bottom hover:align-top truncate">{ formatDate(lastEdit) } by { formatLastEditor(lastEditor) }</p>
            </div>
        </div>
    )
}

export default ReplicaDetails;