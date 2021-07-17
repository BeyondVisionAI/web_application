import React from 'react';
import PricingElement from './PricingElement/PricingElement';
import "./Pricing.css"

const Pricing = () => {
    return (
        <div href="pricing" id="pricing" className="pricing-container">
            <PricingElement animation="fade-right" delay="500" isMainElement={false} buttonMessage="Get It Now !" title="Free Plan" listElements={["Element 1", "Element 2", "Element 3", "Element 4", "Element 5", "Element 6"]} />
            <PricingElement animation="zoom-in" delay="0" isMainElement={true} buttonMessage="Get It Now !" title="Basic Plan" listElements={["Element 1", "Element 2", "Element 3", "Element 4", "Element 5", "Element 6"]} />
            <PricingElement animation="fade-left" delay="500" isMainElement={false} buttonMessage="Get It Now !" title="Pro Plan" listElements={["Element 1", "Element 2", "Element 3", "Element 4", "Element 5", "Element 6"]} />
        </div>
    );
}
 
export default Pricing;