import React, { useContext } from 'react';
import "./Profile.css";
import { AuthContext } from '../../GenericComponents/Auth/Auth';
import { useHistory } from 'react-router-dom';

const Profile = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const history = useHistory();

    return (
        <>
            <div className='navigation'><span onClick={() => history.push('/dashboard')} style={{cursor: 'pointer'}}>Dashboard</span> {' < Profile'}</div>
            <div className='container'>
                <div className='profileContainer'>
                    <div className='profilePictureContainer'>
                        <img className='profilePictureImage' src="/assets/userTempPic.jpg" alt="Your profile picture" />
                    </div>
                    <p className='userName'>{currentUser.firstName} {currentUser.lastName}</p>
                </div>
                <div className='buttonsContainer'>
                    <btn className='profileActionButton'>
                        <img className='profileActionButtonIcon' src="https://cdn-icons-png.flaticon.com/512/1000/1000885.png" alt="Your email" />
                        <p className='profileActionButtonLabel'>{currentUser.email}</p>
                    </btn>
                    <btn className='profileActionButton' onClick={logout}  style={{cursor: 'pointer'}}>
                        <img className='profileActionButtonIcon' src="https://cdn-icons-png.flaticon.com/512/4043/4043198.png" alt="Log out icon" />
                        <p className='profileActionButtonLabel'>Log out</p>
                    </btn>
                </div>
            </div>
        </>
    );
};

export default Profile;