import React from 'react';
import PricingElement from './PricingElement/PricingElement';
import { useTranslation } from 'react-i18next';
import "./Pricing.css"

const Pricing = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'landingPage.pricing'});

    return (
        <div href="pricing" id="pricing" className="pricing-container">
            <PricingElement animation="fade-right" delay="500" isMainElement={false} buttonMessage={t('freePlan.priceLabel')} title={t('freePlan.name')} listElements={[t('freePlan.nProjects'), t('freePlan.5min'), , t('freePlan.watermark')]} />
            <PricingElement animation="zoom-in" delay="0" isMainElement={true} buttonMessage={t('basicPlan.priceLabel')} title={t('basicPlan.name')} listElements={[t('basicPlan.nProjects'), t('basicPlan.collaboration'), t('basicPlan.noWatermark')]} />
            <PricingElement animation="fade-left" delay="500" isMainElement={false} buttonMessage={t('proPlan.priceLabel')} title={t('proPlan.name')} listElements={[t('proPlan.nProjects'), t('proPlan.voiceShop'), t('proPlan.ADReview'), t('proPlan.4K')]} />
        </div>
    );
}

export default Pricing;
