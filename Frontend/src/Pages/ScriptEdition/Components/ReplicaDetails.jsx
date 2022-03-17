import {React, useEffect, useState } from "react";
import CommentBox from './CommentBox';
import axios from 'axios';

const dateOptions =
{
    weekday: 'short', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
};

const ReplicaDetails = ({replica}) => {
    const [text, setText] = useState(replica.content);
    const [voice, setVoice] = useState(replica.voice);
    const [comments, setComments] = useState([]);
    // additional infos 
    const [lastEdit, setLastEdit] = useState(replica.lastEdit);
    const [lastEditor, setLastEditor] = useState(replica.lastEditor);
    const [characterCount, setCharacterCount] = useState("" + replica.content.length + "/100");

    const formatted_date = new Date(lastEdit).toLocaleDateString("fr-FR", dateOptions);
    const handleReplicaTextChange = (event) => {
        setCharacterCount(`${event.target.value.length}/100`);
    }

    const updateReplicaComments = async () => {
        const res = await axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments`,
            // url: `${process.env.REACT_APP_API_URL}/projects/621c3425d3f549034a3e74a4/replicas/6224c73be1677f40bcb942a0/comments`,
            withCredentials: true
        });
        console.log(`/projects/${replica.projectId}/replicas/${replica._id}/comments`);
        console.log(res);
        let resComm = Object.values(res.data);
        console.log(resComm);
        setComments(resComm);
    }

    useEffect(() => {
        const fetchReplicaComments = async () => {
            const res = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/projects/${replica.projectId}/replicas/${replica._id}/comments`,
                // url: `${process.env.REACT_APP_API_URL}/projects/621c3425d3f549034a3e74a4/replicas/6224c73be1677f40bcb942a0/comments`,
                withCredentials: true
            });
            console.log(`/projects/${replica.projectId}/replicas/${replica._id}/comments`);
            console.log(res);
            let resComm = Object.values(res.data);
            console.log(resComm);
            setComments(resComm);
        }

        fetchReplicaComments();
        setText(replica.content);
        setCharacterCount(replica.content.length);
        setVoice(replica.voice);
        // setComments(replica.comments);
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
                <select name="voiceSelection" id="" selected={voice}
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
                {/* <textarea name="replica-text" id="" 
                    // cols="40" rows="2"
                    defaultValue={comment}
                    className="p-3 w-full leading-7 text-l
                    rounded-md border border-solid border-blue-800
                    bg-gray-200 resize-none
                    focus:text-black focus:border-blue-800 focus:outline-none"
                    ></textarea> */}
            </div>

            <div className="w-full align-bottom bg-gray-300">
                <p className="text-right text-gray-400 align-bottom hover:align-top">Dernier changement le {formatted_date} par {lastEditor}</p>
            </div>
        </div>
        </>
        )
}

export default ReplicaDetails;