import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';


class Startup extends Component {

    componentDidMount() {
        const urlOwner = this.props.optionapp[0].serverUrl + "/SelectOwner.php";
        fetch(urlOwner, {
            method: 'POST',
            headers: 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
                chUID: this.props.owner.chUID,
            })
          }).then((response) => response.json()).then((responseServer) => {
            console.log(responseServer);
              
            const val = {
                idCustomer: responseServer.owner[0].idCustomer,
                chUID: this.props.owner.chUID,
                chName: responseServer.owner[0].chName,
                chTagline: responseServer.owner[0].chTagline,
                chEmailStore: responseServer.owner[0].chEmailStore,
                blVerification: responseServer.owner[0].blVerification,
                dDateRegistration: responseServer.owner[0].dDateRegistration,
                iTarif: responseServer.owner[0].iTarif,
                chTimeZone: responseServer.owner[0].chTimeZone,
                chCurrency: responseServer.owner[0].chCurrency,
                blLater: responseServer.owner[0].blLater,
                iDaysAhead: responseServer.owner[0].iDaysAhead,
                iFirstOrder: responseServer.owner[0].iFirstOrder,
                iLastOrder: responseServer.owner[0].iLastOrder,
                blPickup: responseServer.owner[0].blPickup,
                blDelivery: responseServer.owner[0].blDelivery,
            }
            this.props.onAdd(val);  // вызываем action
            this.props.handler();
            
        }).catch((error) => {
              console.error(error);
              this.props.handler();
        });


        const url = this.props.optionapp[0].serverUrl + "/SelectCountOrders.php";
        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            this.checkCountOrder(responseJson.orders_count);
        })
        .catch((error) => {
          console.error(error);
        });


    }

    checkCountOrder = (count) => {
            this.props.onControlOrder({
                allOrderCount: Number(count),
                newOrderCount: 0
            });
    }
  
    render() {
        return <div></div>
    }
  }
  
 
  export default connect(
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
        onAdd: (data) => {
            dispatch({ type: 'LOAD_OWNER_ALL', payload: data});
          },
    }
))(Startup)