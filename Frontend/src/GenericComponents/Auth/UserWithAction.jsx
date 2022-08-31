import React from 'react'
import "./UserWithAction.css"

export default function UserWithAction({ user, child }) {
  return (
    <div className="user-with-action-container" id={user._id}>
        {/* <img src={user.logo} alt={`${ user.firstName } logo`} /> */}
        <div className="user-with-action-user-container">
          <div className="user-initial-pic">
            {`${user.firstName[0]}${user.lastName[0]}`}
          </div>
          <p>{`${user.firstName} ${user.lastName}`}</p>
        </div>
        { child() }
    </div>
  )
}
