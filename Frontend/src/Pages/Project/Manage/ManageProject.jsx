import React, { useEffect, useState } from 'react';
import NavBar from '../../../GenericComponents/NavBar/NavBar';
import axios from 'axios';
import { Downloader } from '../../../GenericComponents/Files/Downloader';

export default function ManageProject(props) {
    const [project, setProject] = useState(null);

    useEffect(() => {
        getProject(props.match.params.id)
    }, []);

    const getProject = async function (id) {
        try {
            let project = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`);

            console.log(project);
            setProject({
                title: project.data.name,
                status: project.data.status,
                thumbnailId: project.data.thumbnailId,
                description: project.data.description
            });
        } catch (error) {
            console.error(error);
        }
    }

// TODO :
//   check if I have the rights
//   Use my colors tailwind, indentation du text, récupération des: collabo, invoices, bouton mode edit, on load
//   Cancel scroll barre
//   Modification de la nav bar
//   Load l'image

    if (project) {
        return (
            <div className='w-full h-screen bg-myWhite'>
                <NavBar />
                <div className='flex w-full h-screen'>
                    <div className='w-2/3 h-full'>
                        <div className='h-3/5 rounded-t-lg m-5 drop-shadow-xl bg-[#ffffff]'>
                            <div className='w-2/4'>
                                <h1 className='indent-1 top-10 p-5 text-2xl font-bold'>{project.title}</h1>
                                <p className='p-5 right-9 text-lg'>{project.description}</p>
                            </div>
                        </div>
                        <div className='h-1/5 flex'>
                            <div className='w-1/2 rounded-bl-lg m-5 drop-shadow-xl bg-[#ffffff]'>
                                Script
                            </div>
                            <div className='w-1/2 rounded-br-lg m-5 drop-shadow-xl bg-[#ffffff]'>
                                Autre
                            </div>
                        </div>
                    </div>
                    <div className='h-full w-1/3 rounded-xl'>
                        <div className='h-1/4 m-8 rounded-t-lg drop-shadow-xl bg-[#ffffff]'>{project.status}</div>
                        <div className='h-1/4 m-8 drop-shadow-xl bg-[#ffffff]'>Collaboration</div>
                        <div className='h-1/4 m-8 rounded-b-lg drop-shadow-xl bg-[#ffffff]'>Invoice</div>
                    </div>
                </div>
                {/*TODO bien placé les bouttons et ne pas les affiché si il n'existe pas */}
                <Downloader bucket='bv-finished-products' keyName={`Video/${props.match.params.id}.mp4`}
                label='Download Video' donwload/>
                <Downloader bucket='bv-finished-products' keyName={`Audio/${props.match.params.id}.mp3`}
                label='Download Audio' donwload/>
            </div>
        );
    } else {
        return (
            <>
                <h1>Project not found</h1>
            </>
        );
    }
}
// TODO: Mettre un temps de chargement quand la donnée n'est pas disponible