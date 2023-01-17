import React from 'react'
import './BreadCrumbs.css'

const BreadCrumbs = ({pathObject}) => {
    
    return (
        <div className='breadcrumbs-container'>
            <div className='breadcrumbs-item-container'>
                <p className='breadcrumbs-item-next'><a className='breadcrumbs-item-link' href={'/dashboard'}> Beyond Vision</a>{'>'}</p>
            </div>
            {pathObject.map((path, idx) => (
                <div key={idx} className='breadcrumbs-item-container'>
                    {idx + 1 < pathObject.length ? <p className='breadcrumbs-item-next'> <a className={idx + 1 < pathObject.length ? 'breadcrumbs-item-link' : 'breadcrumbs-item-link-active'} href={path.url}> {path.name}</a>{'>'}</p> : <p>{path.name}</p>}
                </div>
            ))}
        </div>
    );
}
 
export default BreadCrumbs;