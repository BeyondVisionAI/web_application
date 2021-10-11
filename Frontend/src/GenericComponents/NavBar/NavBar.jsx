import React from 'react';
import { useHistory } from 'react-router-dom';
import "./NavBar.css";
import { withTranslation } from 'react-i18next';

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          showMenu: false,
        }

        this.showMenu = this.showMenu.bind(this);
      }

      showMenu(event) {
        event.preventDefault();

        this.setState({
          showMenu: !this.state.showMenu,
        });
      }


	render () {
		//const history = useHistory()
		const { t } = this.props;
		return (
          <div className="navbar-container">
            <div className="navbar-logo-container">
              <a href="#home">
              <img src="/assets/Logos/Logo small BV.svg" alt="Beyond Vision logo" className="navbar-logo"/>
              </a>
            </div>
            <div className="navbar-links-container">
              <a href="#home" className="navbar-link">{t("navbar-home")}</a>
              <a href="#project" className="navbar-link">{t("navbar-project")}</a>
              <a href="#pricing" className="navbar-link">{t("navbar-pricing")}</a>
              <a href="#aboutus" className="navbar-link">{t("navbar-about_us")}</a>
              <a href="#contact" className="navbar-link">Contact</a>
              {/*<button className="navbar-button" onClick={() => history.push("/login")}>Login</button>*/}
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-btn">
		          <button onClick={this.showMenu}>
		            { "fr" == this.props.i18n.language && (<img src="https://cdn-icons-png.flaticon.com/512/330/330490.png" width="28" height="16"/>) }
		            { "en" == this.props.i18n.language && (<img src="https://cdn-icons-png.flaticon.com/512/330/330425.png" width="28" height="16"/>) }
		            { "es" == this.props.i18n.language && (<img src="https://cdn-icons-png.flaticon.com/512/330/330557.png" width="28" height="16"/>) }
		          </button>
	            </div>
	            {
	              this.state.showMenu && (
                    <ul className="navbar-dropdown-menu">
                      <li className="navbar-dropdown-content">
                        <button
                          className={("fr" == this.props.i18n.language) ? "navbar-selected-link" : "navbar-link"}
                          onClick={()=>{this.props.i18n.changeLanguage("fr")}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/330/330490.png" width="28" height="16"/>
                          FR
                        </button>
                      </li>
                      <li className="navbar-dropdown-content">
                        <button
                          className={("en" == this.props.i18n.language) ? "navbar-selected-link" : "navbar-link"}
                          onClick={()=>{this.props.i18n.changeLanguage("en")}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/330/330425.png" width="28" height="16"/>
                          EN
                        </button>
                      </li>
                      <li className="navbar-dropdown-content">
                        <button
                          className={("es" == this.props.i18n.language) ? "navbar-selected-link" : "navbar-link"}
                          onClick={()=>{this.props.i18n.changeLanguage("es")}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/330/330557.png" width="28" height="16"/>
                          ES
                        </button>
                      </li>
                    </ul>
	              )
                }
              </div>
            </div>
        </div>
      );
    }
}
 
export default withTranslation()(NavBar);