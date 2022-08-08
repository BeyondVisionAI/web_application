import React, { useEffect, useState } from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ReplicaDetails from './Components/ReplicaDetails';
import Timeline from './Components/Timeline';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Chat from '../Chat/Chat';


export default function ScriptEdition(props) {
    const [replicas, setReplicas] = useState([]);
    const [project, setProject] = useState(null);
    const [replicaSelected, setReplicaSelected] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const getProject = async function (id) {
            try {
                let projectR = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`, { withCredentials: true });

                setProject({
                    id: id,
                    title: projectR.data.name
                    // status: projectR.data.status
                });
            } catch (error) {
                console.error(error);
            }
        }

        getProject(props.match.params.id)
    }, [props.match.params.id]);

    const updateReplicaAction = async (selectedId) => {
        setReplicaSelected(selectedId);
    }

    const getReplicaFromId = (id) => {
        for (var i = 0; i < replicas.length; i++) {
            if (replicas[i]._id === id)
                return replicas[i];
        }
        return null;
    }

    const udpateProjectReplica = async (id) => {
        try {
            const res = await axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/projects/${id}/replicas`,
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
        const fetchProjectDetails = async (id) => {
            try {
                const res = await axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API_URL}/projects/${id}/replicas`,
                    withCredentials: true
                });
                let resRep = Object.values(res.data);
                setReplicas(resRep);
            } catch (e) {
                let errMsg = "Error";
                console.log(e);
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
        fetchProjectDetails(props.match.params.id);
    }, [props.match.params.id]);

    const RedirectToProjectManagement = () => {
        history.push(`/project/${props.match.params.id}`);
    }


    if (project) {
        return (
            <>
                <div className="script-edition-container h-screen w-screen overflow-x-hidden">
                    <NavBar />
                    <div id="page-container" className="w-screen h-5/6 py-2 px-6">
                        <div id="title" className="h-1/10 w-full flex flex-row justify-between items-center py-4">
                            <h1 className="text-blue-400 w-1/3 inline-flex items-center text-3xl">{project.title}</h1>
                            <button className="bg-blue-600 w-min h-1/5 rounded-full text-white truncate p-3 inline-flex items-center text-base" onClick={() => RedirectToProjectManagement()}>Soumettre</button>
                        </div>

                        <div id="edit-bloc" className="flex h-4/6">

                        <div id="menu-detail" className="bg-gray-100 w-1/3 mx-1 shadow-lg rounded-tl-3xl">
                            {replicaSelected !== null ?
                                <ReplicaDetails replica={getReplicaFromId(replicaSelected)} updateReplicaList={udpateProjectReplica}/>
                            :   <div className='w-full h-full bg-cover bg-center flex flex-col justify-center' style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('/assets/hatched.png')"}}>
                                    <p className='w-2/3 text-black self-center text-center bg-gray-100 rounded'>Veuillez sélectionner une réplique afin d'afficher ses détails</p>
                                </div>
                            }

                        </div>
                           <div id="movie-insight" className="flex justify-center content-end w-2/3 rounded-tr-3xl mx-1 shadow-lg bg-gray-100">
                               <img className="object-cover h-10/12" src="/assets/fight_club.jpeg" alt="" />
                           </div>
                        </div>

                        <div className="flex h-1/3 w-full px-2 pb-6 mt-2">
                           <Timeline className="w-full h-full bg-gray-100 rounded-b-3xl opacity-50 shadow-lg" replicas={replicas} projectId={project.id} onReplicaSelection={updateReplicaAction} updateReplicaList={udpateProjectReplica} />
                        </div>
                    </div>
                </div>
                <Chat projectId={props.match.params.id}/>
            </>
        )
    } else {
        return (
            <h1>Non</h1>
        )
    }
}
