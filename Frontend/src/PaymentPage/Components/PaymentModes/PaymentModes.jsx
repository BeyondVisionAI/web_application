import React from 'react';
import "./PaymentModes.css"
import PaymentMode from "./PaymentMode/PaymentMode";

const PaymentModes = () => {
  return (
    <div className="payment-modes-container">

      <PaymentMode price="19.90" serviceName="Service Basic" serviceLevel={1}/>

      <PaymentMode price="34.90" serviceName="Service Premium" serviceLevel={2}/>

      <PaymentMode price="59.90" serviceName="Service Ultimate" serviceLevel={3}/>

    </div>
  );
}
 
export default PaymentModes;