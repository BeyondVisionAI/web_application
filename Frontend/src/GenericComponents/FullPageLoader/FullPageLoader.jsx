import React from 'react'

import {BounceLoader} from 'react-spinners';

const FullPageLoader = () => {
    return ( 
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
        }}>
            <BounceLoader color='#7793ED' />
        </div>
     );
}
 
export default FullPageLoader;