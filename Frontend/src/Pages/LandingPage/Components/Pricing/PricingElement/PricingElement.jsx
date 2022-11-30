import React, { useEffect } from 'react';
import "./PricingElement.css"
import Aos from 'aos'

const PricingElement = (props) => {
    useEffect(() => {
        Aos.init({duration: "1500", disable: 'mobile'})
    }, []);
    return (
        <div data-aos={props.animation} data-aos-delay={props.delay} className={props.isMainElement ? "pricing-element-container" : "pricing-element-container-secondary"}>
            <h1>{props.title}</h1>
            <ul className="pricing-list">
                {props.listElements.map((item, key) => {
                    return (<li className="pricing-list-element" key={key}>{item}</li>)
                })}
            </ul>
            <button className="price-button">{props.buttonMessage}</button>
        </div>
    );
}
 
export default PricingElement;
