
import React, { Component } from 'react';
import { connect } from 'react-redux';


class Startup extends Component {
    componentDidMount() {
        
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
    }),
    dispatch => ({
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
    }
))(Startup)