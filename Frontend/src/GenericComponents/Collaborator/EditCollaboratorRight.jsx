import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditCollaboratorRight = (props) => {
    const [rights, setRights] = useState([...props.rights]);

    async function updateCollaboratorRight(event) {
        event.preventDefault();

        try {
            var res = await axios.put(`${process.env.REACT_APP_API_URL}/api/collaborator/`,
                {
                    userID: props.userID,
                    projectID: props.projectID,
                    canWrite: rights[0].value,
                    canRead: rights[1].value,
                    canDownload: rights[2].value
                }
            )
            if (res.status === 200)
                toast("Collaborateur mise à jour");
            else
                toast("Error");
            } catch(err) {
                console.error(err);
            }
    }

    function handleChange(event) {
        const target = event.target;
        var i = rights.findIndex((obj => obj.name == target.value));
        var newRights = [...rights];

        newRights[i].value = target.checked;
        setRights(newRights);
    }

    const rightsCheckbox = () => rights.map(right => (
        <label key={right.name}>{right.name}
            <input type="checkbox" name="Right" value={right.name} checked={right.value} onChange={handleChange}/>
        </label>
    ));

    return (
        <form>
            {rightsCheckbox()}
            <br />
            <button onClick={updateCollaboratorRight}>Update rights</button>
        </form>
    )
}
export default EditCollaboratorRight;