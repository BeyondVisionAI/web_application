import {React } from "react";
import './ReplicaDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const EmptyReplicaDetails = () => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center py-2 px-6">
            <h1>No replica selected</h1>
        </div>
    )
}

export default EmptyReplicaDetails;