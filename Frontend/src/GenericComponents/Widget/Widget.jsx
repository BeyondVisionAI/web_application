import React from 'react';

export default function Widget(props) {
  return (
    <div className={`${props.weight} ${props?.rounded} flex m-5 drop-shadow-xl bg-white`}>
        {props.children}
    </div>
  )
}

// TODO:
//  Add loading, Title ?
//  Update button