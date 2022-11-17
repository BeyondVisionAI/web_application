import React from 'react';
import PricingElement from './PricingElement/PricingElement';
import "./Pricing.css"

const Pricing = () => {
    return (
        <div href="pricing" id="pricing" className="pricing-container">
            <PricingElement animation="fade-right" delay="500" isMainElement={false} buttonMessage="FREE" title="Free Plan" listElements={["Up to 5 projects", "5 minutes long video maximum", , "Watermark Beyond Vision"]} />
            <PricingElement animation="zoom-in" delay="0" isMainElement={true} buttonMessage="€5.99/month" title="Basic Plan" listElements={["Up to 10 projects", "Collaborative projects", "Export the finished videos without watermark"]} />
            <PricingElement animation="fade-left" delay="500" isMainElement={false} buttonMessage="€7.99/month" title="Pro Plan" listElements={["Unlimited projects", "Voice shop advantages", "Certified audiodescription review", "Export the finished videos in 4K"]} />
        </div>
    );
}
 
export default Pricing;