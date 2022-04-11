import React, { useContext, useEffect, useState } from 'react'
import "./PaymentForm.css"
import { PropTypes } from 'prop-types';
import axios from "axios"
import Checkout from './Checkout';
import { toast } from 'react-toastify';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
const stripePromise = loadStripe("pk_test_51KTBRyJkPRyJJUzIcZr6S3kPKviTPBuoBPyM9OrLdDj9MnLqUMRDVbjOckMUY9EDLDXRRAX3t25wcQXi99hxSKk000Mi0pGqGH");

const PaymentForm = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [stripeOption, setStripeOptions] = useState({
        clientSecret: ''
    })

    const appearance = {
        theme: 'stripe',
        labels: 'floating',
        variables: {
          colorPrimary: '#7793ED',
          colorBackground: '#ffffff',
          colorText: '#000000',
          colorDanger: '#ff5151',
          fontFamily: 'Roboto, sans-serif',
          spacingUnit: '2px',
          borderRadius: '4px',
        }
    };

    async function getSecret() {
        try {
            var res = await axios({
                method: "POST",
                data: {
                    amount: props.amount,
                    currency: props.currency,
                },
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/payment/createIntent`,
            })
            if (res.status === 200) {
                var clientSecret = res.data.clientSecret
                setStripeOptions({
                    clientSecret,
                    appearance
                })
                setIsLoading(false)
            }
        } catch (err) {
            toast.error("Error while contacting the server")
        }
    }

    useEffect(() => {
        getSecret()
    }, [props.amount, props.currency]);

    if (isLoading) {
        return (
            <div>
                <h1>
                    Loading....
                </h1>
            </div>
        )
    }

    return (
        <Elements stripe={stripePromise} options={stripeOption}>
            <div className='checkout-container'>
                <Checkout currency={props.currency} amount={props.amount} redirectUrl={props.redirectUrl}/>            
            </div>
        </Elements>
    );
}

PaymentForm.propTypes = {
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    redirectUrl: PropTypes.string.isRequired
}

export default PaymentForm;