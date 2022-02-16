import React, { useContext } from 'react'
import Button from '../../GenericComponents/Button/Button';
import { AuthContext } from '../../GenericComponents/Auth/Auth';

export default function Dashboard() {


    const {logout, currentUser} = useContext(AuthContext)
    
    return (
        <div>
            <h1>Dashboard</h1>
            <Button onClick={logout} label="Logout" />
            <p>{JSON.stringify(currentUser)}</p>
        </div>
    )
}
