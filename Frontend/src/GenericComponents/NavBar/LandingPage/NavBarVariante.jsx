import NavBar from "../NavBar";
import { useHistory } from 'react-router-dom';

export default function NavBarVariante() {
  const history = useHistory();

  const pushToLogin = () => history.push("/login");
  const rightButtons = [
    {type: 'LINK', href:"#home",texte: "Home"},
    {type: 'LINK', href:"#project", texte: "The Project"},
    {type: 'LINK', href:"#pricing", texte: "Pricing"},
    {type: 'LINK', href:"#aboutus", texte: "About Us"},
    {type: 'LINK', href:"#timeline", texte: "Timeline"},
    {type: 'LINK', href:"#contact", texte: "Contact"},
    {type: 'BUTTON', onClick: pushToLogin, texte: "Login"},
  ];

  return (
    <NavBar
      homeRef='#home'
      rightButtons={rightButtons}
    />
  )
}
