import React, { useEffect, useState } from 'react'
import Button from '../../../GenericComponents/Button/Button';
import PaymentForm from '../../../GenericComponents/PaymentForm/PaymentForm';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';
import { toast } from 'react-toastify';

export default function VideoData({ prevStep, handleChange, values, postData }) {
    const [paymentAmount, setPaymentAmount] = useState(null);
    const [createPayment, setCreatePayment] = useState(false);
    const [areAllRequiredFieldsFilled, setAreAllRequiredFieldsFilled] = useState(true); // TODO False Default
    const regexAmount = "^([0-9]+([.][0-9]*)?|[.][0-9]+)$";
    const next = e => {
        e.preventDefault();
        postData();
    }
    const prev = e => {
        e.preventDefault();
        prevStep();
    }

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
            {createPayment && <PaymentForm amount={paymentAmount} currency='EUR' redirectUrl={'http://localhost/dashboard'} />}


            <div className="absolute bottom-0 right-0 p-6">
                <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={prev}
                >
                Back
                </button>
                <button
                disabled={!areAllRequiredFieldsFilled}
                className={`font-bold uppercase text-sm px-6 py-3 rounded shadow focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${areAllRequiredFieldsFilled ? 'hover:bg-emerald-600 text-black hover:shadow-lg' : 'cursor-not-allowed text-gray-200'}`}
                type="button"
                onClick={next}
                >
                Next
                </button>
            </div>
        </div>
    )
}