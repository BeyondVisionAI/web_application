import React, { useEffect, useState } from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ReplicaDetails from './Components/ReplicaDetails';
import Timeline from './Components/Timeline';
import axios from 'axios';
import { toast } from 'react-toastify';

const tempReplica = {
    content: "This is an example of a replica",
    voice: "plop",
    comments: [
        "This is an example of a replica's nested comment",
        "Other comment written about this replica, which should overflow on itself since its quite long aaaaaaaaaaaaaaaaaaaaaaaaa eeeeeeeeeeeeeeeeeee eeeeaeaeaeaaeaae aeaeaeaea",
        "I would like to comment something else",
        "This should be an overflowing comment in the list"
    ],
    lastEdit: Date.now(),
    lastEditor: "John Doe"
}

const tempTLR = [
    {content: "first replica"},
    {content: "second replica"},
    {content: "third replica"},
    {content: "fourth replica"}
]

const ScriptEdition = ( {project, video} ) => {
    const [replicas, setReplicas] = useState([]);
    const [replicaSelected, setReplicaSelected] = useState(null);

    const updateReplicaAction = async (selectedId) => {
        console.log("bjr");
        setReplicaSelected(selectedId);
    }

    const getReplicaFromId = (id) => {
        for (var i = 0; i < replicas.length; i++) {
            if (replicas[i]._id === id)
                return replicas[i];
        }
        return null;
    }

    const udpateProjectReplica = async () => {
        try {
            const res = await axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/projects/${project.projectId}/replicas`,
                withCredentials: true
            });
            let resRep = Object.values(res.data);
            setReplicas(resRep);
        } catch (e) {
            let errMsg = "Error";
            switch (e.response.status) {
                case 401:
                    switch (e.response.data) {
                        case "USER_NOT_LOGIN": errMsg = "Error (401) - User is not logged in."; break;
                        /* errors that fits the 403 to me */
                        case "PROJECT_NOT_YOURS": errMsg = "Error (401) - No collaboration found between the userId and the project."; break;
                        default: errMsg = "Error (401)."; break;
                    } break;
                case 403: errMsg = "Error (403) - User has no right to access the content."; break;
                case 404:
                    switch (e.response.data) {
                        case "PROJECT_NOT_FOUND": errMsg = "Error (404) - Missing project."; break;
                        case "REPLICA_NOT_FOUND": errMsg = "Error (404) - Missing replica."; break;
                        default: errMsg = "Error (404)."; break;
                    } break;
                default /* 500 */ : errMsg = "Internal Error."; break;
            }
            toast.error(errMsg);
            console.error(e);
        }
    }


    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const res = await axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API_URL}/projects/${project.projectId}/replicas`,
                    withCredentials: true
                });
                let resRep = Object.values(res.data);
                console.log("res replica : " + resRep);
                console.table(resRep);
                setReplicas(resRep);
            } catch (e) {
                let errMsg = "Error";
                switch (e.response.status) {
                    case 401:
                        switch (e.response.data) {
                            case "USER_NOT_LOGIN": errMsg = "Error (401) - User is not logged in."; break;
                            /* errors that fits the 403 to me */
                            case "PROJECT_NOT_YOURS": errMsg = "Error (401) - No collaboration found between the userId and the project."; break;
                            default: errMsg = "Error (401)."; break;
                        } break;
                    case 403: errMsg = "Error (403) - User has no right to access the content."; break;
                    case 404:
                        switch (e.response.data) {
                            case "PROJECT_NOT_FOUND": errMsg = "Error (404) - Missing project."; break;
                            case "REPLICA_NOT_FOUND": errMsg = "Error (404) - Missing replica."; break;
                            default: errMsg = "Error (404)."; break;
                        } break;
                    default /* 500 */ : errMsg = "Internal Error."; break;
                }
                toast.error(errMsg);
                console.error(e);
            }
        }
        fetchProjectDetails();
    }, []);


    return (
        <>
            <div className="script-edition-container h-screen w-screen">
                <NavBar />
                <div id="page-container" className="h-5/6 w-full py-2 px-6">
                    <div id="title" className="h-1/10 w-full flex flex-row justify-between items-center py-4">
                        <h1 className="text-blue-400 w-1/3 inline-flex items-center text-3xl">{project.title}</h1>
                        <button className="bg-blue-600 w-min h-1/5 rounded-full text-white truncate p-3 inline-flex items-center text-base">Soumettre</button>
                    </div>

                    <div id="edit-bloc" className="flex h-4/6">

                    <div id="menu-detail" className="bg-gray-100 w-1/3 mx-1 shadow-lg rounded-tl-3xl">
                        {replicaSelected !== null ?
                            <ReplicaDetails replica={getReplicaFromId(replicaSelected)}/>
                        :   <div className='w-full h-full bg-cover bg-center flex flex-col justify-center' style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('/assets/hatched.png')"}}>
                                <p className='w-2/3 text-black self-center text-center bg-gray-100 rounded'>Veuillez sélectionner une réplique afin d'afficher ses détails</p>
                            </div>
                        }

                    </div>
                       <div id="movie-insight" className="flex justify-center content-end w-2/3 rounded-tr-3xl mx-1 shadow-lg bg-red-500">
                           <img className="object-cover" src="/assets/fight_club.jpeg" alt="" />
                       </div>
                    </div>

                    <div className="flex h-1/3 w-full px-2 pb-6 mt-2">
                       <Timeline className="w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg" replicas={replicas} projectId={project.projectId} onReplicaSelection={updateReplicaAction} updateReplicaList={udpateProjectReplica} />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ScriptEdition;