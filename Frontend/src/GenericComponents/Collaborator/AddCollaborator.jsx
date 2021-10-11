import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCollaborator = ({ setLoading, projectID }) => {
    const [collaborator, setCollaborator] = useState({
        userID: null,
        projectID: projectID,
        canWrite: false,
        canRead: false,
        canDownload: false
    });

    async function createCollaborator(event) {
        event.preventDefault();
        try {
            var res = await axios.post(`${process.env.REACT_APP_API_URL}/api/collaborator/`, collaborator);

            if (res.status === 200) {
                toast("Collaborator added");
                setLoading(true);
            } else
                toast("Error");
        } catch (error) {
            console.error(error);
        }
    }

    function handleChange(event) {
        const target = event.target;
        var newCollaborator = { ...collaborator };

        if (target.type === 'checkbox')
            newCollaborator[target.value] = target.checked;
        else
            newCollaborator[target.name] = target.value;
        setCollaborator(newCollaborator);
    }

    return (
        <form>
            <fieldset>
                <legend>Ajout de collaborateur</legend>

                <label for="userID">User Id</label>
                <input type="text" name="userID" id="userID" onChange={handleChange}/>
                <br/>

                <input type="checkbox" name="Right" value="canWrite" checked={collaborator.canWrite} onChange={handleChange}/> Write
                <input type="checkbox" name="Right" value="canRead" checked={collaborator.canRead} onChange={handleChange}/> Read
                <input type="checkbox" name="Right" value="canDownload" checked={collaborator.canDownload} onChange={handleChange}/> Download
            </fieldset>

            <button onClick={createCollaborator}>Add collaborator</button>
        </form>
    )
}
export default AddCollaborator;