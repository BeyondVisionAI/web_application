import React , { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './Auth';
import './Auth.css';
import CircleButton from '../Button/CircleButton';

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
        <CircleButton url="/user-icon.png" size='30px' onClick={() => {userClick()}}/>
        {isUserMenuActive &&
          <div className='userMenuContainer'>
              <Link to={'/profile'}>
                  Your profile
              </Link>
              <hr/>
              <btn onClick={logout} style={{cursor:'pointer'}}>
                  <FontAwesomeIcon
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
