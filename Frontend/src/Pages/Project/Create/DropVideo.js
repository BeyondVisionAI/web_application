import React, { useState } from 'react';
// import axios from 'axios';
import { toast } from "react-toastify";
import UploadFile from '../../../GenericComponents/Files/UploadFile';

export default function DropVideo({ nextStep, handleChange, values }) {
  const [video, setVideo] = useState(null);

  const onVideoChange = e => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();

      // formData.append('inputFile', e.target.files[0]);

      setVideo(e.target.files[0]);
    }
  }

  const pushVideo = e => {
    // axios.post();
    e.preventDefault();
    toast("Video uploaded");
    handleChange('videoLink', "urlVideo");
    nextStep();
  } // TODO: complete this fonction Waiting Marco

  return (
      <form class='h-full'>
        <div class="relative group w-full h-64 flex justify-center items-center">
          <UploadFile inputChange={ onVideoChange } isFill={video ? true : false} types=".jpg, .jpeg, .png" other={ video ? <p class="relative z-20 cursor-pointer text-blue-500 hover:text-blue-600 block">{ video.name }</p> : null }/>
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
