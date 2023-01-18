import React , { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './Auth';
import './Auth.css';
import ImageButton from '../Button/ImageButton';

export default function AccountButton() {
  const history = useHistory();
  const { currentUser, logout } = useContext(AuthContext);
  const [ isUserMenuActive, setIsUserMenuActive ] = useState(false);

  const userClick = () => {
    if (currentUser)
      setIsUserMenuActive(!isUserMenuActive);
    else
      history.push('/login');
  }

  return (
    <div>
      <div className="dropdown">
        <ImageButton type="UserIcon" onClick={() => {userClick()}}/>
        {isUserMenuActive &&
          <div className='userMenuContainer'>
              <Link className='slide-container' to={'/profile'}>
                  Your profile
              </Link>
              <hr/>
              <btn className='slide-container' onClick={logout} style={{cursor:'pointer'}}>
                  <FontAwesomeIcon className="slide-content"
                      style={{color: 'red'}}
                      icon={faSignOutAlt}/>
                  Log out
              </btn>
          </div>
        }
      </div>
    </div>
  )
}
