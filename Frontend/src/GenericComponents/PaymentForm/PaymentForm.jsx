import React, { useContext, useEffect, useState } from 'react'
import "./PaymentForm.css"
import { PropTypes } from 'prop-types';
import axios from "axios"
import Checkout from './Checkout';
import { toast } from 'react-toastify';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_CLIENT_KEY);

const PaymentForm = (props) => {
    const { tErr } = useTranslation('translation', {keyPrefix: 'errMsgs'});
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
                    projectId: props.projectId,
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
            toast.error(tErr("serverError"))
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
    redirectUrl: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired
}

export default PaymentForm;