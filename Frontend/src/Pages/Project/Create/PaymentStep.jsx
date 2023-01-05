import React, { useEffect } from 'react'
import PaymentForm from '../../../GenericComponents/PaymentForm/PaymentForm';
import { useTranslation } from 'react-i18next';

export default function PaymentStep({ values, postData, showPayment}) {
    const { t } = useTranslation('translation', {keyPrefix: 'project.create.step3'});
    useEffect(() => {
        if (!showPayment)
            postData();
    }, []);

    return (
        <div className="w-full h-full p-3 flex flex-col justify-center items-center">
            {
                showPayment ?
                    <PaymentForm amount={`${Math.round(values.videoDuration * 0.25)}`} currency='EUR' redirectUrl={`http://localhost/dashboard`} projectId={ values.id } /> :
                    <h1>{t('creatingProject')}</h1>
            }
        </div>
    );
}
