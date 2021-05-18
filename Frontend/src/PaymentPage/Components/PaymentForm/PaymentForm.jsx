import React from 'react';
import "./PaymentForm.css"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CreditCardIcon from '@material-ui/icons/CreditCard';

const PaymentForm = () => {
  return (
    <div className="payment-form-container">

      <Card className="payment-form-card" variant="outlined">
        <FormControl>
          <InputLabel>Moyen de paiement</InputLabel>
          <Select>
            <MenuItem>
              <CreditCardIcon/>
              Carte bleue
            </MenuItem>
            <MenuItem disabled>
              Paypal
            </MenuItem>
          </Select>
        </FormControl>

        <CardContent>
          <form>

            <div className="payment-form-horizontal">
              <TextField
                className="payment-form-field"
                label="Prénom"
                id="firstname"
                variant="filled"
              />
              <TextField
                className="payment-form-field"
                label="Nom"
                id="lastname"
                variant="filled"
              />
            </div>

            <div className="payment-form-horizontal">
              <TextField
                className="payment-form-field"
                label="Adresse mail"
                id="filled-start-adornment"
                variant="filled"
              />
            </div>

            <div className="payment-form-horizontal">
              <TextField
                className="payment-form-field"
                label="Carte de crédit"
                id="filled-start-adornment"
                variant="filled"
              />
            </div>

            <div className="payment-form-horizontal">
              <TextField
                className="payment-form-field"
                label="Date d'expiration"
                id="filled-start-adornment"
                variant="filled"
              />
              <TextField
                className="payment-form-field"
                label="CCV"
                id="filled-start-adornment"
                variant="filled"
              />
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
 
export default PaymentForm;