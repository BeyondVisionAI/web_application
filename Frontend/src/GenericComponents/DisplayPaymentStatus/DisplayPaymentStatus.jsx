import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const DisplayPaymentStatus = () => {
  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({paymentIntent}) => {
        switch (paymentIntent.status) {
          case 'succeeded':
            toast.success("Payment successfully processed")
            break;

          case 'processing':
            toast.warning("Payment processing. We'll update you when payment is received.")
            break;
          case 'requires_payment_method':
            toast.error("Payment failed. Please try another payment method.")
            break;

          default:
            toast.error('Something went wrong.');
            break;
        }
      });
  }, [stripe]);

  return null;
};

export default DisplayPaymentStatus;