import React, { useEffect } from 'react'
import PaymentForm from '../../../GenericComponents/PaymentForm/PaymentForm';

export default function PaymentStep({ values, postData, showPayment}) {
    useEffect(() => {
        if (!showPayment)
            postData();
    }, []);

    return (
        <div className="w-full h-full p-3 flex flex-col justify-center items-center">
            {
                showPayment ?
                    <PaymentForm amount={`${Math.round(values.videoDuration * 0.25)}`} currency='EUR' redirectUrl={`http://localhost/dashboard`} projectId={ values.id } /> :
                    <h1>Project is creating, please wait</h1>
            }
        </div>
    );
}
