import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import InputWithLabel from '../../../../GenericComponents/InputWithLabel/InputWithLabel';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AddFolderModal({ closeModal, addToFolderList }) {
    const [folderName, setFolderName] = useState('')

    const wrapperRef = useRef(null);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    closeModal()
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
          closeModal()
        }
      }, []);
      useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, []);

    useOutsideAlerter(wrapperRef);

    const handleChange = (value) => {
        setFolderName(value);
    }

    const handleAdd = async () => {
        if (folderName === '') {
            toast.error('Folder name cannot be empty')
        }
        try {
            var res = await axios({
                url: `${process.env.REACT_APP_API_URL}/lists`,
                method: 'POST',
                withCredentials: true,
                data: {
                    name: folderName,
                }
            })
            toast.success("Folder successfully created")
            addToFolderList(res.data)
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className='justify-center' style={{zIndex: 1000}}></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" style={{zIndex: 1000}}>
                <div ref={wrapperRef} className="relative w-1/4 my-6 mx-auto max-w-7xl h-1/4">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none h-full focus:outline-none">
                        <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3>Add a folder</h3>
                            <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => closeModal()}
                            >
                                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        <div className='flex items-start w-full justify-start h-full ml-4 mt-4 flex-col'>
                            <InputWithLabel label='Folder Name' type='text' onChange={handleChange}/>
                            <div onClick={handleAdd} className='flex items-center justify-center w-8 h-8 bg-myBlue text-white rounded-full absolute right-5 bottom-5 cursor-pointer'><FaPlus /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}
// TODO: Handle error and required elements