import {React } from "react";
import './ReplicaDetails.css';


const EmptyReplicaDetails = () => {
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
                <textarea name="replica-text"
                    maxLength='100' rows={3}
                    value='--------'
                    className="w-full resize-none px-2 py-1 text-base
                    rounded-md border border-solid border-blue-500
                    focus:text-black focus:bg-white focus:border-blue-500 focus:outline-none">
                </textarea>
            </div>

            <div>
                {/* Voix */}
                <div className="w-full flex flex-row justify-between items-center mb-1">
                    <h3 className="section-title">Voix :</h3>
                    <select name="voiceSelection" id=""
                        disabled='true'
                        className="inline-flex items-center form-select form-select-lg
                        w-1/2 p-2 text-base 
                        border border-solid border-blue-300 rounded">
                        <option value="addVoice">--------</option>
                    </select>
                </div>

                {/* Starting time */}
                <div className="w-full flex flex-row justify-between items-center mt-1">
                    <h3 className="section-title">Commence à:</h3>
                    <input type='text' defaultValue='--:--:--' disabled='true'
                        className="inline-flex items-center
                        w-1/2 p-2 text-base
                        border border-solid border-blue-300 rounded">
                    </input>
                </div>
            </div>

            {/* Commentaires */}
            <div className="w-full flex flex-row justify-between items-center">
                <h3 className="section-title">Commentaires:</h3>
                <h3>0</h3>
            </div>
            <input type="text" placeholder="Écrivez votre nouveau commentaire"
                disabled='true'
                className="py-2 px-2 w-fit leading-7 text-base select
                mb-4
                rounded-md border border-solid border-blue-800
                bg-gray-200 resize-none"/>

            <button
                disabled='true'
                className="bg-gray-400 w-1/8 h-1/8 rounded-full text-white truncate p-3 items-center text-base mb-2">{"Sauvegarder"}</button>
        </div>
    )
}

export default EmptyReplicaDetails;