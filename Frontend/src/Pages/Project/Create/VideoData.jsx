import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../GenericComponents/Button/Button';
import { AuthContext } from '../../../GenericComponents/Auth/Auth';
import PaymentForm from '../../../GenericComponents/PaymentForm/PaymentForm';
import InputWithLabel from '../../../GenericComponents/InputWithLabel/InputWithLabel';
import DisplayPaymentStatus from '../../../GenericComponents/DisplayPaymentStatus/DisplayPaymentStatus';
import axios from "axios"
import { toast } from 'react-toastify';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_CLIENT_KEY);
export default function VideoData({ prevStep, handleChange, values, postData }) {
    const {logout, currentUser} = useContext(AuthContext);
    const [isRedirectFromPayment, setIsRedirectFromPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(null);
    const [createPayment, setCreatePayment] = useState(false);
    const [arePaymentLoaded, setArePaymentLoaded] = useState(false);
    const [Payments, setPayments] = useState();
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

    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );
        if (clientSecret) {
            setIsRedirectFromPayment(true);
        }
        getPreviousPayments();
    }, []);

    async function getPreviousPayments(params) {
        try {
            var res = await axios({
                method: "GET",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/payment/getPayment`,
            });
            console.log("🚀 ~ file: Dashboard.jsx ~ line 38 ~ getPreviousPayments ~ res", res.data);
            setPayments(res.data);
            setArePaymentLoaded(true);
        } catch (error) {
            console.log("🚀 ~ file: Dashboard.jsx ~ line 43 ~ getPreviousPayments ~ error", error);
            toast.error("Couldn't Load Payments");
            setArePaymentLoaded(true);
        }
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
        <form onSubmit={e => e.preventDefault()} className="w-full h-full">
            <InputWithLabel onChange={setPaymentAmount} verifyRegex={regexAmount} label='Payment Amount' errorMessage="Not a positive float" type='text'/>
            <Button onClick={startPayment} label="Create Payment" />

            {createPayment && <PaymentForm amount={paymentAmount} currency='EUR' redirectUrl={'http://localhost/dashboard'} />}
            <p>{JSON.stringify(currentUser)}</p>
            <h2>Payments</h2>
            {arePaymentLoaded && <p>{JSON.stringify(Payments)}</p>}

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
        </form>
    )
}