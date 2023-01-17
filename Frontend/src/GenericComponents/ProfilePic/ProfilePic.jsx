import "./ProfilePic.css"

const ProfilePic = ({initials, label, size}) => {
    return (
        <div className="profile-pic-container">
            <div className={`profile-pic-item${size === 'large' ? ' large' : ''}`}>
                {initials}
            </div>
            {label && <p>{label}</p>}
        </div>
        
     );
}
 
export default ProfilePic;