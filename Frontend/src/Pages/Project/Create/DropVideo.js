import React, { useState } from 'react';
// import axios from 'axios';
import { toast } from "react-toastify";

export default function DropVideo({ nextStep, handleChange, values }) {
  const [video, setVideo] = useState(null);

  const onVideoChange = e => {
    if (e.target.files && e.target.files[0]) {
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
    <div>
      <form>
        <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="thumbnail"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={onVideoChange}
            />
      </form>
      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button
          disabled={ video ? false : true }
          className="bg-emerald-500 text-blue active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={pushVideo}
          >
          Next
          </button>
      </div>
    </div>
  );
}

// TODO: change css button on disabled //