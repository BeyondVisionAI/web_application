/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import PaymentForm from '../../../GenericComponents/PaymentForm/PaymentForm';
import { useTranslation } from 'react-i18next';

export default function PaymentStep({ values, postData, showPayment}) {
    const [price, setPrice] = useState(1);
    const { t } = useTranslation('translation', {keyPrefix: 'project.create.step3'});
    useEffect(() => {
        if (!showPayment)
            postData();
    }, []);

    useEffect(() => {
        let priceTmp = Math.round(values.videoDuration * 0.25);
        setPrice(priceTmp > 1 ? priceTmp : 1);
    }, [values.videoDuration]);

    return (
        <div className="w-full h-full p-3 flex flex-col justify-center items-center">
            {
                showPayment ?
                    <PaymentForm amount={`${price}`} currency='EUR' redirectUrl={`http://localhost/dashboard`} projectId={ values.id } /> :
                    <h1>{t('creatingProject')}</h1>
            }
        </div>
    );
}
