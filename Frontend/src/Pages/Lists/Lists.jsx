import axios from 'axios';
import React from 'react'
import "./Lists.css"
import ProjectsList from './Components/ProjectsList/ProjectsList';
import ModalAddProjectToList from './Components/ModalAddProjectToList/ModalAddProjectToList';
import ModalRemoveProjectFromList from './Components/ModalRemoveProjectFromList/ModalRemoveProjectFromList';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import ModalDestroyLeaveProject from './Components/ModalDestroyLeaveProject/ModalDestroyLeaveProject';
import ModalDestroyLeaveList from './Components/ModalDestroyLeaveList/ModalDestroyLeaveList';
import CreateProject from '../Project/Create/CreateProject';
import NavBarVariante from '../../GenericComponents/NavBar/Dashboard/NavBarVariante';

export default function Lists() {

    const [input, setInput] = useState('');
    const [customLists, setCustomLists] = useState([]);
    const [myProjectsList, setMyProjectsList] = useState({ id: 0, name: "My projects", movies: [] });
    const [sharedProjectsList, setSharedProjectsList] = useState({ id: 1, name: "Shared with me", movies: [] });

    //Modals
    const [addProjectToListPopupOpen, setAddProjectToListOpen] = useState(false);
    const [removeProjectFromListPopupOpen, setRemoveProjectFromListOpen] = useState(false);
    const [destroyLeaveProjectPopupOpen, setDestroyLeaveProjectOpen] = useState(false);
    const [destroyLeaveListPopupOpen, setDestroyLeaveListOpen] = useState(false);
    const [modalShow, setShowModal] = useState(false);

    //Variables for modals
    const [projectToModify, setProjectToModify] = useState(0);
    const [listToModify, setListToModify] = useState(0);

    var [isFinished, setIsFinished] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const getMyProjects = async () => {
            try {
                setMyProjectsList({ id: 0, name: "My projects", movies: [] });
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/mine`,
                });
                setIsFinished(true);
                res.data.forEach(movie => {
                    setMyProjectsList(prev => ({
                        ...prev,
                        movies: [...prev.movies, movie]
                    }));
                });
            } catch (err) {
                toast.error("Email couldn't be verified, try again later")
                setIsFinished(true)
            }
        };

        const getSharedProjects = async () => {
            try {
                setSharedProjectsList({ id: 1, name: "Shared with me", movies: [] })
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/shared`,
                });
                setIsFinished(true);
                res.data.forEach(movie => {
                    setSharedProjectsList(prev => ({
                        ...prev,
                        movies: [...prev.movies, movie]
                    }));
                });
            } catch (err) {
                toast.error("Email couldn't be verified, try again later")
                setIsFinished(true)
            }
        };

        const getAllCustomLists = async () => {
            try {
                setCustomLists([]);
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists`,
                });
                setIsFinished(true);
                res.data.forEach(list => {
                    setCustomLists(prev => ([
                        ...prev,
                        {
                            id: list._id,
                            name: list.name,
                            movies: list.projects
                        }
                    ]))
                });
            } catch (err) {
                toast.error("Email couldn't be verified, try again later")
                setIsFinished(true)
            }
        };

        getMyProjects();
        getSharedProjects();
        getAllCustomLists();
        return function cleanup() {
        };
    }, [refreshKey]);

    const handleOpenAddProjectToListPopup = (projectId) => {
        setAddProjectToListOpen(true);
        setProjectToModify(projectId);
    };
    const handleCloseAddProjectToListPopup = () => {
        setAddProjectToListOpen(false);
        setProjectToModify(0);
    };

    const handleOpenRemoveProjectFromListPopup = (projectId, listId) => {
        setRemoveProjectFromListOpen(true);
        setProjectToModify(projectId);
        setListToModify(listId);
    };
    const handleCloseRemoveProjectFromListPopup = () => {
        setRemoveProjectFromListOpen(false);
        setProjectToModify(0);
        setListToModify(0);
    };

    const handleOpenDestroyLeaveProjectPopup = (projectId) => {
        setDestroyLeaveProjectOpen(true);
        setProjectToModify(projectId);
    };
    const handleCloseDestroyLeaveProjectPopup = () => {
        setDestroyLeaveProjectOpen(false);
        setProjectToModify(0);
    };

    const handleOpenDestroyLeaveListPopup = (listId) => {
        setDestroyLeaveListOpen(true);
        setListToModify(listId);
    };
    const handleCloseDestroyLeaveListPopup = () => {
        setDestroyLeaveListOpen(false);
        setListToModify(0);
    };

    if (!isFinished) {
        return (
            <div className="page-container">
                <NavBarVariante input={input} updateInput={(input) => setInput(input)}/>
            </div>
        );
    } else {
        return (
            <div className="page-container">
                <NavBarVariante input={input} updateInput={(input) => setInput(input)}/>

                <ModalAddProjectToList refresh={setRefreshKey} open={addProjectToListPopupOpen} close={handleCloseAddProjectToListPopup}
                    projectId={projectToModify}></ModalAddProjectToList>
                <ModalRemoveProjectFromList refresh={setRefreshKey} open={removeProjectFromListPopupOpen} close={handleCloseRemoveProjectFromListPopup}
                    projectId={projectToModify} listId={listToModify}></ModalRemoveProjectFromList>
                <ModalDestroyLeaveProject refresh={setRefreshKey} open={destroyLeaveProjectPopupOpen} close={handleCloseDestroyLeaveProjectPopup}
                    projectId={projectToModify}></ModalDestroyLeaveProject>
                <ModalDestroyLeaveList refresh={setRefreshKey} open={destroyLeaveListPopupOpen} close={handleCloseDestroyLeaveListPopup}
                    listId={listToModify}></ModalDestroyLeaveList>

                <div className='flex justify-end p-1 sticky top-24 z-10'>
                    <button
                    className="bg-myBlue text-white active:bg-myBlack
                        flex justify-center items-center h-12 w-12 mr-4
                        font-bold uppercase text-xl rounded-full shadow outline-none
                        hover:shadow-lg focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(true)}
                    >+</button>
                </div>

                {modalShow ? (
                    <CreateProject
                        show={modalShow}
                        onHide={() => setShowModal(false)}
                    />
                ): null}

                {
                    myProjectsList.movies.length > 0 ?
                    <ProjectsList key={0} id="My projects" list={myProjectsList}
                    openAddProjectToList={handleOpenAddProjectToListPopup}
                    openRemoveProjectFromList={handleOpenRemoveProjectFromListPopup}
                    openDestroyLeaveProject={handleOpenDestroyLeaveProjectPopup}
                    openDestroyLeaveList={handleOpenDestroyLeaveListPopup}/>
                    : null
                }
                {
                    sharedProjectsList.movies.length > 0 ?
                    <ProjectsList key={1} id="Shared with me" list={sharedProjectsList}
                    openAddProjectToList={handleOpenAddProjectToListPopup}
                    openRemoveProjectFromList={handleOpenRemoveProjectFromListPopup}
                    openDestroyLeaveProject={handleOpenDestroyLeaveProjectPopup}
                    openDestroyLeaveList={handleOpenDestroyLeaveListPopup}/>
                    : null
                }
                {
                    customLists.map((list, index) => (
                        (list) && (list.movies) && (list.movies.length > 0) ?
                            <ProjectsList key={index} id={list.id} list={list}
                            openAddProjectToList={handleOpenAddProjectToListPopup}
                            openRemoveProjectFromList={handleOpenRemoveProjectFromListPopup}
                            openDestroyLeaveProject={handleOpenDestroyLeaveProjectPopup}
                            openDestroyLeaveList={handleOpenDestroyLeaveListPopup}/> : <div key={index}></div>
                    ))
                }
            </div>
        )
    }
}