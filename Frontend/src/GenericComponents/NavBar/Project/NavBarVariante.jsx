import React from 'react'
import AccountButton from '../../Auth/AccountButton'
import NavBar from '../NavBar'
import CollaboratorsButton from './CollaboratorsComponents/CollaboratorsButton'

export default function NavBarVariante({ projectId }) {
    const renderCollaboratorsButton = (
            <CollaboratorsButton key='collaboratorsButton' projectId={projectId} isEditable/>
    )

    return (
        <NavBar
            homeRef='/dashboard'
            others={[renderCollaboratorsButton, AccountButton()]}
        />
    )
}
