import {React, useState } from "react";

const dateOptions =
{
    weekday: 'short', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
};

const ReplicaDetails = ({replica}) => {
    const [text, setText] = useState(replica.text);
    const [voice, setVoice] = useState(replica.voice);
    const [comment, setComment] = useState(replica.comment);
    // additional infos
    const [lastEdit, setLastEdit] = useState(replica.lastEdit);
    const [lastEditor, setLastEditor] = useState(replica.lastEditor);

    return (
        <div className="h-full m-auto">
            <h3>Texte</h3>
            <textarea name="replica-text" id="" 
            cols="40" rows="2"
            defaultValue={text}
            className="p-3 max-w-full leading-normal
            rounded-md border border-solid border-blue-800
            focus:border-red-500"
            ></textarea>

            <h3>Voix</h3>
            <select name="voiceSelection" id="" selected={voice}>
                <option value="toto">toto</option>
                <option value="plop">plop</option>
                <option value="foo">foo</option>
                <option value="bar">bar</option>
            </select>

            <h3>Commentaires</h3>
            <textarea name="replica-text" id="" 
            cols="40" rows="2"
            defaultValue={comment}
            className="p-3 max-w-full leading-normal
            rounded-md border border-solid border-blue-800
            bg-gray-400 focus:border-red-500"
            ></textarea>


            <p>Dernier changement le {lastEdit} par {lastEditor}</p>
        </div>
        )
}

export default ReplicaDetails;