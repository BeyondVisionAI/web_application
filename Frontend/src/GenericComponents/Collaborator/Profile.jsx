import React, { useEffect, useState } from "react";
import axios from 'axios';

const Profile = (props) => {
    // const [profile, setProfile] = useState({ _id: null, icon: null, username: null});

    // async function getProfile(profileID) {
    //     try {
    //         var res = await axios({
    //             methode: "GET",
    //             url: `${process.env.REACT_APP_API_URL}/api/profile/${profileID}`
    //         });
    //         console.log(res);
    //         setProfile(res.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // useEffect(() => {
    //     getProfile(profileID);
    // }, [])
    return (
        <div>
            {/* <img src={profile.icon} alt="Profile icon" /> */}
            <h3>{props.userID}</h3>
        </div>
    )
}

export default Profile;