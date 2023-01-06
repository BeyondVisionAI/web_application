import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const DisplayPaymentStatus = () => {
  const stripe = useStripe();
  const { t } = useTranslation('translation', {keyPrefix: "payment"});
  const { t: tErr } = useTranslation('translation', {keyPrefix: 'errMsgs'});
  const { t: tWarn } = useTranslation('translation', {keyPrefix: 'warningMsgs.payment'});

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
            toast.success(t("paymentSuccess"))
            break;

          case 'processing':
            toast.warning(tWarn("paymentProcessing"))
            break;
          case 'requires_payment_method':
            toast.error(tErr("payment.paymentFail"));
            break;

          default:
            toast.error(tErr('somethingWenWrong'));
            break;
        }
      });
  }, [stripe]);

  return null;
};

export default DisplayPaymentStatus;
