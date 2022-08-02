import React from 'react'

export default function UserWithAction({ user, child }) {
  return (
    <div>
        {/* <img src={user.logo} alt={`${ user.firstName } logo`} /> */}
        {`${user.firstName} ${user.lastName}`}
        { child() }
    </div>
  )
}
