import React, { useState } from "react";
import { PropTypes } from 'prop-types';
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Button from "../Button/Button";
import "./Checkout.css"


const Checkout = (props) => {
  const stripe = useStripe();
  const elements = useElements();



  const [errorMessage, setErrorMessage] = useState(null);

  if (!stripe || !elements) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
        return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: props.redirectUrl,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2 className="payment-label">Payment for {props.amount + " " + props.currency}</h2>
      <PaymentElement />
      <br />
      <Button disabled={!stripe} label="Submit" onClick={() => console.log("a")}></Button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

Checkout.propTypes = {
    redirectUrl: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
}

export default Checkout;
