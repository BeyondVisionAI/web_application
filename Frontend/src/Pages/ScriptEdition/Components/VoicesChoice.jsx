/* eslint-disable react-hooks/exhaustive-deps */
import {React, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const VoiceChoices = ({ voiceId, setVoiceIdSelected, replicaId }) => {
    const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs.voiceChoices'});
    const [voiceIndexSelected, setVoiceIndexSelected] = useState(undefined);
    const [voiceIdTemp, setVoiceIdTemp] = useState(undefined);
    const [voiceOptions, setVoiceOptions] = useState([]);
    const [languageSelected, setLanguageSelected] = useState(0);
    const [languageOptions, setLanguageOptions] = useState(['Tous']);

    const voiceName = function(nameId, language) {
        if (languageOptions[languageSelected] === "Tous")
            return (nameId + ' - ' + language);
        else
            return (nameId);
    }

    const handleLanguageChange = function(e) {
        setLanguageSelected(e.target.value);
    }

    const handleVoiceChange = function(e) {
        setVoiceIndexSelected(e.target.value);
        setVoiceIdSelected(voiceOptions[e.target.value].id);
        setVoiceIdTemp(voiceOptions[e.target.value].id)
    }

    const changeVoiceIndexSelected = function(voiceId, arr) {
        if (!arr && arr.length > 0) {
            const index = arr.findIndex(item => {
                return item.id === voiceId
            });

            if (index === -1) {
                setVoiceIndexSelected(0);
                setVoiceIdSelected(arr[0].id);
                setVoiceIdTemp(0);
            } else {
                setVoiceIndexSelected(index);
                setVoiceIdSelected(arr[index].id);
                setVoiceIdTemp(arr[index].id);
            }
        }
    }

    async function retrieveLanguages() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_IA_URL}/Voice/RetrieveLanguages`);
            const temp = ["Tous"];

            for (const language of response.data.language)
                temp.push(language);
            setLanguageOptions(temp);
        } catch (err) {
            toast.error(tErr("getAllLanguages"));
        }
    }

    async function retrieveVoices() {
        try {
            let response = '';

            if (languageOptions[languageSelected] === 'Tous')
                response = await axios.get(`${process.env.REACT_APP_SERVER_IA_URL}/Voice/RetrieveVoices`);
            else
                response = await axios.get(`${process.env.REACT_APP_SERVER_IA_URL}/Voice/RetrieveVoices`, { params: { language: languageOptions[languageSelected] }});
            setVoiceOptions(response.data.voices);
            changeVoiceIndexSelected(voiceId, response.data.voices);
        } catch (err) {
            toast.error(tErr("getAllVoices"));
        }
    }

    async function checkVoiceId() {
        if (voiceId >= 0) {
            const index = voiceOptions.findIndex(item => item.id === voiceId);

            if (index === -1) {
                setLanguageSelected(0);
                retrieveVoices();
            } else {
                setVoiceIndexSelected(index);
            }
        }
    }

    useEffect(async () => {
        retrieveLanguages();
    }, []);

    useEffect(async () => {
        retrieveVoices();
    }, [languageSelected]);

    useEffect(async () => {
        if (voiceIdTemp !== voiceId) {
            checkVoiceId();
        }
    }, [voiceId]);

    useEffect(async () => {
        setLanguageSelected(0);
        retrieveVoices();
    }, [replicaId]);

    return (
        <div>
            <div className="w-full flex flex-row justify-between items-center mb-1">
                <h3 className="section-title">Voix language :</h3>
                <select
                    name="languageSelection" id="languageSelection"
                    value={ languageSelected }
                    className="inline-flex items-center form-select form-select-lg
                    w-2/5 p-2 mr-9
                    text-xl
                    border border-solid border-blue-300 rounded
                    transition ease-in-out
                    focus:text-black focus:bg-white focus:border-blue-300 focus:outline-none"
                    onChange={ handleLanguageChange }>
                    {
                        languageOptions &&
                        languageOptions.map((value, index) => (
                            <option key={ index } value={ index }>
                                { value }
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className="w-full flex flex-row justify-between items-center mb-1">
                <h3 className="section-title">Voix :</h3>
                <select
                    name="voiceSelection" id="voiceSelection"
                    value={ voiceIndexSelected }
                    className="inline-flex items-center form-select form-select-lg
                    w-2/5 p-2 mr-9
                    text-xl
                    border border-solid border-blue-300 rounded
                    transition ease-in-out
                    focus:text-black focus:bg-white focus:border-blue-300 focus:outline-none"
                    onChange={ handleVoiceChange }>
                    {
                        voiceOptions &&
                        voiceOptions.map(
                            (option, index) => (
                                <option key={ index } value={ index }>
                                    {voiceName(option.nameID, option.language)}
                                </option>
                            )
                        )
                    }
                </select>
            </div>
        </div>
    );
}

export default VoiceChoices;