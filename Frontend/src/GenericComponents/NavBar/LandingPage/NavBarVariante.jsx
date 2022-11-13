import NavBar from "../NavBar";
import AccountButton from "../../Auth/AccountButton";
import { useTranslation } from 'react-i18next';

export default function NavBarVariante() {
  const { t } = useTranslation('translation', {keyPrefix: 'navigation.landingPage'});

  const rightButtons = [
    {type: 'LINK', href:"#home",texte: t('home')},
    {type: 'LINK', href:"#project", texte: t('project')},
    {type: 'LINK', href:"#pricing", texte: t('pricing')},
    {type: 'LINK', href:"#aboutus", texte: t('about_us')},
    {type: 'LINK', href:"#timeline", texte: t('timeline')},
    {type: 'LINK', href:"#contact", texte: t('contact')},
  ];

  return (
    <NavBar
      homeRef='#home'
      rightButtons={rightButtons}
      others={[AccountButton()]}
    />
  )
}
