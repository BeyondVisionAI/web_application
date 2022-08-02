import NavBar from "../NavBar";
import AccountButton from "../../Auth/AccountButton";

export default function NavBarVariante() {
  const rightButtons = [
    {type: 'LINK', href:"#home",texte: "Home"},
    {type: 'LINK', href:"#project", texte: "The Project"},
    {type: 'LINK', href:"#pricing", texte: "Pricing"},
    {type: 'LINK', href:"#aboutus", texte: "About Us"},
    {type: 'LINK', href:"#timeline", texte: "Timeline"},
    {type: 'LINK', href:"#contact", texte: "Contact"},
  ];

  return (
    <NavBar
      homeRef='#home'
      rightButtons={rightButtons}
      others={[AccountButton()]}
    />
  )
}
