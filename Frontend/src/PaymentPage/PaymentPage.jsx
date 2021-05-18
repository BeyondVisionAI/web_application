import React from 'react';
import "./PaymentPage.css"
import NavBar from './../GenericComponents/NavBar/NavBar';
import PaymentModes from './Components/PaymentModes/PaymentModes';
import PaymentForm from './Components/PaymentForm/PaymentForm';

const PaymentPage = () => {
    return (
        <div className="payment-page-container">
            <NavBar />
            <PaymentModes />
            <PaymentForm />
        </div>
    );
}
 
export default PaymentPage;