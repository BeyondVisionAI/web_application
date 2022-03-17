import axios from 'axios';
import React from 'react'
import "./Lists.css"
import NavBar from './Components/Navbar/NavBar';
import ProjectsList from './Components/ProjectsList/ProjectsList';
// import ListsData from './Data/lists.json';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

export default function Lists() {

    const [input, setInput] = useState('');
    const [customLists, setCustomLists] = useState([]);
    const [allProjectsList, setAllProjectsList] = useState({id: 0, name: "All projects", movies: []});

    var [isFinished, setIsFinished] = useState(false);

    const updateInput = async (input) => {
        setInput(input);
    }

    useEffect(() => {

        const getMyProjects = async () => {
            try {
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/mine`,
                });
                toast.success("Data get")
                setIsFinished(true);
                res.data.forEach(movie => {
                    setAllProjectsList(prev => ({
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
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists/shared`,
                });
                toast.success("Data 2 get")
                setIsFinished(true);
                res.data.forEach(movie => {
                    setAllProjectsList(prev => ({
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
                var res = await axios({
                    method: "GET",
                    withCredentials: true,
                    url: `${process.env.REACT_APP_API_URL}/lists`,
                });
                toast.success("Data 3 get")
                setIsFinished(true);
                console.log(res.data);
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
                // res.data.forEach(movie => {
                //     setAllProjectsList(prev => ({
                //         ...prev,
                //         movies: [...prev.movies, movie]
                //     }));
                // });
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
    }, []);

    const displayData = () => {
        console.log(allProjectsList);
    };

    if (!isFinished) {
        return (
            <div className="page-container">
                <NavBar input={input} setInput={updateInput} />
            </div>
        );
    } else {
        return (
            <div className="page-container">
            <NavBar input={input} setInput={updateInput} />

            {/* <p>{allProjectsList.movies.name}</p> */}
            <button onClick={displayData}>toto</button>

            <ProjectsList key={0} id="allProjects" list={allProjectsList}/>
            {/* {
                allProjectsList.movies.length > 0 ?
                allProjectsList.movies.map((movie, index) => (
                    <p key={index}>{movie.name}</p>
                )) : <p>tata</p>
            } */}

            {
                customLists.map((list, index) => (
                    (list) && (list.movies) && (list.movies.length > 0) ?
                    <ProjectsList key={index} id={list.id} list={list} /> : <div key={index}></div>
                ))
            }

            {/* <ProjectsList /> */}

            {/* <div className="grid grid-cols-8 md:grid-cols-5 sm:grid-cols-3 gap-4 px-10 py-8">
                {
                    Data.filter(project => {
                        if (input === '') {
                            return project;
                        } else if (project['project-name'].toLowerCase().includes(input.toLowerCase())) {
                            return project;
                        }
                    }).map((project, index) => (
                        <div className="box" key={index}>
                            <p>Name: {project['project-name']}</p>
                            <p>Categorie: {project.categorie}</p>
                            <p>Owner: {project.owner}</p>
                            <p>Collaborators: {project.collaborators}, {project.collaborators_2}</p>
                            <p>Picture: {project.picture}</p>
                        </div>
                    ))
                }
            </div> */}
        </div>
        )
    }
}

// Typesense, c'est important