import React , { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './Auth';
import './Auth.css';
import { useTranslation } from 'react-i18next';
import ImageButton from '../Button/ImageButton';

export default function AccountButton() {
  const { t } = useTranslation('translation', {keyPrefix: 'authentication.authButton'});
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
        <ImageButton type="UserIcon" onClick={ () => { userClick() } }/>
        {isUserMenuActive &&
          <div className='userMenuContainer'>
              <Link to='/profile'>{ t('yourProfile') }</Link>
              <Link to='/dashboard'>{ t('yourDashboard') }</Link>
              <hr/>
              <btn onClick={ logout } style={ { cursor:'pointer' } } >
                  <FontAwesomeIcon className="slide-content"
                      style={ { color: 'red' } }
                      icon={ faSignOutAlt }/>
                  { t('signout') }
              </btn>
          </div>
        }
      </div>
    </div>
  )
}
