import "./ProfilePic.css"

const ProfilePic = ({initials, label}) => {
    return (
        <div className="profile-pic-container">
            <div className="profile-pic-item">
                {initials}
            </div>
            {label && <p>{label}</p>}
        </div>
        
     );
}
 
export default ProfilePic;