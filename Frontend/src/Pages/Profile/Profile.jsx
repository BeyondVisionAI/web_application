import React, { useContext } from 'react';
import { AuthContext } from '../../GenericComponents/Auth/Auth';
import BreadCrumbs from '../../GenericComponents/BreadCrumbs/BreadCrumbs';
import "./Profile.css";
import ProfilePic from '../../GenericComponents/ProfilePic/ProfilePic';

const Profile = () => {
    const { currentUser, logout } = useContext(AuthContext);

    return (
        <>
            <BreadCrumbs pathObject={[{url: '/profile', name: 'Profile'}]} />
            <div className='container'>
                <div className='profileContainer'>
                    <div className='profilePictureContainer'>
                        <ProfilePic initials={`${currentUser.firstName[0]}${currentUser.lastName[0]}`} size='large'/>
                    </div>
                    <p className='userName'>{currentUser.firstName} {currentUser.lastName}</p>
                </div>
                <div className='buttonsContainer'>
                    <btn className='profileActionButton'>
                        <img className='profileActionButtonIcon' src="https://cdn-icons-png.flaticon.com/512/1000/1000885.png" alt="Your email" />
                        <p className='profileActionButtonLabel'>{currentUser.email}</p>
                    </btn>
                    <btn className='profileActionButton criticalAction' onClick={logout}  style={{cursor: 'pointer'}}>
                        <img className='profileActionButtonIcon' src="https://cdn-icons-png.flaticon.com/512/4043/4043198.png" alt="Log out icon" />
                        <p className='profileActionButtonLabel'>Log out</p>
                    </btn>
                </div>
            </div>
        </>
    );
};

export default Profile;