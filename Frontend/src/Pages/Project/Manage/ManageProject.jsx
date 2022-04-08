import React, { useEffect, useState } from 'react';
import NavBar from '../../../GenericComponents/NavBar/NavBar';
import { DownloadFileUrl } from '../../../GenericComponents/Files/S3Manager';
import axios from 'axios';

export default function ManageProject(props) {
    const [project, setProject] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        const getProject = async function (id) {
            try {
                let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`);

                setProject({
                    title: projectR.data.name,
                    status: projectR.data.status,
                    thumbnailId: projectR.data.thumbnailId,
                    description: projectR.data.description
                });
                if (projectR.data.thumbnailId)
                    getData(props.match.params.id, projectR.data.thumbnailId);
            } catch (error) {
                console.error(error);
            }
        }

        getProject(props.match.params.id)
    }, [props.match.params.id]);

    async function getData (projectId, thumbnailId) {
        try {
            let image = await axios.get(`${process.env.REACT_APP_API_URL}/images/${projectId}/${thumbnailId}`);
            let url = await DownloadFileUrl('bv-thumbnail-project', image.data.name);
            setThumbnail(url);
        } catch (err) {
            console.error(`Getting file ${thumbnailId} on S3`, err);
        }
    }

    const dispThumbnail = () => {
        if (thumbnail)
            return (<img className='object-scale-down w-2/4' src={ thumbnail } alt='thumbnail'></img>);
        return (<div class="flex flex-wrap shadow-xl rounded"></div>);
    }

// TODO :
//   Check if I have the rights
//   indentation du text, récupération des: collabo, invoices, bouton mode edit, on load
//   Cancel scroll barre
//   Modification de la nav bar
//   Mettre un temps de chargement quand la donnée n'est pas disponible

    if (project) {
        return (
            <div className='w-full h-screen bg-myWhite'>
                <NavBar />
                <></>
                <div className='flex w-full h-screen'>
                    <div className='w-2/3 h-full'>
                        <div className='h-3/5 rounded-t-lg m-5 drop-shadow-xl bg-white flex'>
                            <div className='w-2/4'>
                                <h1 className='indent-1 top-10 p-5 text-2xl font-bold'>{project.title}</h1>
                                <p className='p-5 right-9 text-lg'>{project.description}</p>
                            </div>
                            <div className='w-2/4'>
                                { dispThumbnail() }
                            </div>
                        </div>
                        <div className='h-1/5 flex'>
                            <div className='w-1/2 rounded-bl-lg m-5 drop-shadow-xl bg-white'>
                                Script
                            </div>
                            <div className='w-1/2 rounded-br-lg m-5 drop-shadow-xl bg-white'>
                                Autre
                            </div>
                        </div>
                    </div>
                    <div className='h-full w-1/3 rounded-xl'>
                        <div className='h-1/4 m-8 rounded-t-lg drop-shadow-xl bg-white'>{project.status}</div>
                        <div className='h-1/4 m-8 drop-shadow-xl bg-white'>Collaboration</div>
                        <div className='h-1/4 m-8 rounded-b-lg drop-shadow-xl bg-white'>Invoice</div>
                    </div>
                </div>
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