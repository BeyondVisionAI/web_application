import {React } from "react";
import './ReplicaDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

const EmptyReplicaDetails = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'scriptEdition.replicaDetails'});
    return (
        <div className="h-full w-full flex flex-col justify-center items-center py-2 px-6">
            <h1>{t('empty')}</h1>
        </div>
    )
}

export default EmptyReplicaDetails;