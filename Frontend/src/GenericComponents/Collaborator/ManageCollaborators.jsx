import React, { useEffect, useState } from "react";
import axios from 'axios';
import Profile from './Profile';
import EditCollaboratorRight from "./EditCollaboratorRight";
import AddCollaborator from "./AddCollaborator";

const ManageCollaborators = ({ projectID }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getCollaborators(projectID) {
        try {
            var res  = await axios.get(`${process.env.REACT_APP_API_URL}/api/collaborator/${projectID}`);

            setCollaborators(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    function deleteCollaborator(collaboratorID, projectID) {
        try {
            axios.delete(`
                ${process.env.REACT_APP_API_URL}/api/collaborator`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                      userIDs: [collaboratorID],
                      projectIDs: [projectID]
                    }
                }
            ).then(res => {
                if (res.status === 200)
                    setLoading(true);
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCollaborators(projectID);
        setLoading(false);
    }, [loading]);

    const renderCollaborator = () => {
        if (!collaborators) {
            return (<li>No collaborator in this project</li>);
        }
        return (collaborators.map(collaborator => {
            return (
                <li key={collaborator.userID}>
                    <Profile userID={collaborator.userID}></Profile>
                    <button onClick={() => deleteCollaborator(collaborator.userID, collaborator.projectID)}>Delete</button>
                    <EditCollaboratorRight userID={collaborator.userID} projectID={collaborator.projectID} rights={[
                        { name: 'Write', value: collaborator.canWrite },
                        { name: 'Read', value: collaborator.canRead},
                        { name: 'Download', value: collaborator.canDownload}]
                    }/>
                </li>
            );
        }));
    };

    return (
        <div>
            <ul>
                {renderCollaborator()}
            </ul>
            <br />

            <AddCollaborator setLoading={setLoading} projectID={projectID} />
        </div>
    )
}

export default ManageCollaborators;