import React, { useEffect, useState } from 'react'
import Button from '../../../GenericComponents/Button/Button';
import PaymentForm from '../../../GenericComponents/PaymentForm/PaymentForm';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';
import { toast } from 'react-toastify';

export default function PaymentStep({ values, postData }) {
    const [paymentAmount, setPaymentAmount] = useState(null);
    const [createPayment, setCreatePayment] = useState(false);
    const regexAmount = "^([0-9]+([.][0-9]*)?|[.][0-9]+)$";

    useEffect(() => {
        postData();
    }, []);

    function startPayment() {
        const regex = new RegExp(regexAmount);

        if (!paymentAmount) {
            toast.error('No Amount');
        } else if (!regex.test(paymentAmount)) {
            toast.error('Invalid Amount');
        } else {
            setCreatePayment(true);
        }
    }

    return (
        <div className="w-full h-full p-3">
            <div className='flex flex-col justify-center'>
                <InputWithLabel onChange={setPaymentAmount} verifyRegex={regexAmount} label='Payment Amount' errorMessage="Not a positive float" type='text'/>
                <Button onClick={startPayment} label="Create Payment" />
            </div>
            {createPayment && <PaymentForm amount={paymentAmount} currency='EUR' redirectUrl={`http://localhost/project/${values.id}`} projectId={ values.id } />}
        </div>
    )
}