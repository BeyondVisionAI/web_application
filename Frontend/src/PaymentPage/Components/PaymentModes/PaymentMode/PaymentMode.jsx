import React from 'react';
import PropTypes from "prop-types";
import "./PaymentMode.css"
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Cancel, CheckCircle} from '@material-ui/icons';
import { green } from '@material-ui/core/colors';

class PaymentMode extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card className="payment-mode-card" variant="outlined">
        <CardHeader title={this.props.price + "€ par mois"} subheader={this.props.serviceName} className="payment-mode-header" />

        <CardContent>
          <List>

            <ListItem>
              <ListItemIcon>
                <CheckCircle style={{ color: green[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Galerie de projets"/>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircle style={{ color: green[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Partager des projet avec ses équipes de travail" secondary="(limité à 1 équipe de 10 membres maximum)"/>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                {
                  (2 <= this.props.serviceLevel) ?
                    <CheckCircle style={{ color: green[500] }}/>
                  : <Cancel color="disabled"/>
                }
              </ListItemIcon>
              <ListItemText className={(2 > this.props.serviceLevel) && "disabled-feature-container"} primary="Optimisation du traitement des vidéos par l'IA"/>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                {
                  (3 <= this.props.serviceLevel) ?
                    <CheckCircle style={{ color: green[500] }}/>
                  : <Cancel color="disabled"/>
                }
              </ListItemIcon>
              <ListItemText className={(3 > this.props.serviceLevel) && "disabled-feature-container"} primary="Lecture de script par un acteur professionnel"/>
            </ListItem>

          </List>
        </CardContent>
      </Card>
    );
  }

}

PaymentMode.propTypes = {
  price: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  serviceLevel: PropTypes.number.isRequired
};

export default PaymentMode;