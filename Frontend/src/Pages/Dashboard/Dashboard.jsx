import React, { useContext, useEffect, useState } from 'react'
import Button from '../../GenericComponents/Button/Button';
import { AuthContext } from '../../GenericComponents/Auth/Auth';
import DisplayPaymentStatus from '../../GenericComponents/DisplayPaymentStatus/DisplayPaymentStatus';
import PaymentForm from '../../GenericComponents/PaymentForm/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import InputWithLabel from '../../GenericComponents/InputWithLabel/InputWithLabel';
import { toast } from 'react-toastify';
import axios from "axios"
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_CLIENT_KEY);

export default function Dashboard() {
    const {logout, currentUser} = useContext(AuthContext)
    const [isRedirectFromPayment, setIsRedirectFromPayment] = useState(false)
    const [paymentAmount, setPaymentAmount] = useState(null)
    const [createPayment, setCreatePayment] = useState(false)
    const [arePaymentLoaded, setArePaymentLoaded] = useState(false)
    const [Payments, setPayments] = useState()
    const regexAmount = "^([0-9]+([.][0-9]*)?|[.][0-9]+)$"

    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );
        if (clientSecret) {
            setIsRedirectFromPayment(true)
        }
        getPreviousPayments()
    }, []);

    async function getPreviousPayments(params) {
        try {
            var res = await axios({
                method: "GET",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/payment/getPayment`,
            })
            console.log("🚀 ~ file: Dashboard.jsx ~ line 38 ~ getPreviousPayments ~ res", res.data)
            setPayments(res.data)
            setArePaymentLoaded(true)
        } catch (error) {
            console.log("🚀 ~ file: Dashboard.jsx ~ line 43 ~ getPreviousPayments ~ error", error)
            toast.error("Couldn't Load Payments")
            setArePaymentLoaded(true)
        }
    }

    function startPayment() {
        const regex = new RegExp(regexAmount);
        if (!paymentAmount) {
            toast.error('No Amount')
        } else if (!regex.test(paymentAmount)) {
            toast.error('Invalid Amount')
        } else {
            setCreatePayment(true)
        }
    }

    return (
        <div>
            {isRedirectFromPayment && <Elements stripe={stripePromise}><DisplayPaymentStatus /></Elements>}
            <h1>Dashboard</h1>
            <Button onClick={logout} label="Logout" />
            <InputWithLabel onChange={setPaymentAmount} verifyRegex={regexAmount} label='Payment Amount' errorMessage="Not a positive float" type='text'/>
            <Button onClick={startPayment} label="Create Payment" />
            {createPayment && <PaymentForm amount={paymentAmount} currency='EUR' redirectUrl={'http://localhost/dashboard'} />}
            <p>{JSON.stringify(currentUser)}</p>
            <h2>Payments</h2>
            {arePaymentLoaded && <p>{JSON.stringify(Payments)}</p>}
        </div>
    )
}
