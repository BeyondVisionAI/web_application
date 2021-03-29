import React from 'react';
import "./Presentation.css"

const Presentation = () => {
    return (
        <div className="presentation-container">
            <div className="presentation-title-container">
                <h1 className="presentation-title">Audiodécrivez vos vidéos avec Beyond Vision</h1>
                <p className="presentation-under-title">Chez Beyond Vision, notre souhait est d'augmenter la quantité de contenu disponible en audio description
                    grace à la puissance de l'intelligence artificielle.
                </p>
            </div>
            <div className="presentation-image-container">
                <img src="/assets/ecran.png" alt="écran avec un aperçu de la plateforme beyond vision" className="presentation-image"/>
            </div>
        </div>
    );
}
 
export default Presentation;