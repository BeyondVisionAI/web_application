import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import UploadFile from '../../../GenericComponents/Files/UploadFile';

export default function DropVideo({ nextStep, handleChange, values }) {
    const [video, setVideo] = useState(null);

    const onVideoChange = e => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            let reader = new FileReader();

            formData.append('name', e.target.files[0].name);
            formData.append('description', `${e.target.files[0].name} of project ${values.title}`);
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                formData.append("buffer", reader.result);
                setVideo(formData);
            }
        }
    }

    const pushVideo = e => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/video`, video,
        {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data`,
            }
        }
        ).then(res => {
            toast("Video uploaded");
            handleChange('videoId', res.data._id);
        }).catch(err => {
            toast(err);
            console.error(err);
        });
        nextStep();
    }

  return (
        <form class='h-full'>
            <div class="relative group w-full h-64 flex justify-center items-center">
                <UploadFile inputChange={ onVideoChange } isFill={video ? true : false} types=".mov, .mp4, .wav" other={ video ? <p class="relative z-20 cursor-pointer text-blue-500 hover:text-blue-600 block">{ video.name }</p> : null }/>
            </div>
            <div className="absolute bottom-0 right-0 p-6">
                <button
                disabled={ video ? false : true }
                className={`font-bold uppercase text-sm px-6 py-3 rounded shadow focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${video ? 'active:bg-emerald-600 text-black hover:shadow-lg' : 'cursor-not-allowed text-gray-200'}`}
                type="button"
                onClick={pushVideo}
                >
                Next
                </button>
            </div>
        </form>
  );
}
// TODO: change format input handle