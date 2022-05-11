import React from 'react';
import PricingElement from './PricingElement/PricingElement';
import "./Pricing.css"

const Pricing = () => {
    return (
        <div href="pricing" id="pricing" className="pricing-container">
            <PricingElement animation="fade-right" delay="500" isMainElement={false} buttonMessage="Get It Now !" title="Free Plan" listElements={["Up to 3 projects", "Edit your scripts"]} />
            <PricingElement animation="zoom-in" delay="0" isMainElement={true} buttonMessage="Get It Now !" title="Basic Plan" listElements={["Up to 10 projects", "Edit your scripts", "Export the finished videos"]} />
            <PricingElement animation="fade-left" delay="500" isMainElement={false} buttonMessage="Get It Now !" title="Pro Plan" listElements={["Unlimited projects", "Edit your scripts", "Export the finished videos"]} />
        </div>
    );
}
 
export default Pricing;