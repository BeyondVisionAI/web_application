import React from 'react';
import "./Member.css"

const Member = (props) => {
    return (
        <div className="member-container">
            {/* <img src={props.picture} alt={`${props.name}`} /> */}
            <h3>{props.name}</h3>
            <p>{props.position}</p>
        </div>
    );
}
 
export default Member;
