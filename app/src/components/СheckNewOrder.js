import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import Sound from 'react-sound';


class test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playSound: false,
        }
        const url = this.props.optionapp[0].serverUrlStart + "/NotificationNewOrder.php?chUID=" + this.props.owner.chUID + "&CountOrder=" + this.props.owner.CountOrder;
        this.eventSource = new EventSource(url);
    }
    

    componentDidMount() {
        this.subscribeToServerEvent();
    }

    subscribeToServerEvent = () => {
        this.eventSource.onmessage = e => {
          try {
              console.log(e);
              
            //this.setState({ ..... })
          } catch (e) {
            console.log('error parsing server response', e)
          }
        }
    }

    render() {
        return (<Fragment></Fragment>)
    }
}


export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
        changeStatus: (data) => {
            dispatch({ type: 'CHANGE_OPTIONAPP_CLOUD_STATUS', payload: data});
          },
    })
  )(test);


/*
class test extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            playSound: false,
        }
      
    }

    componentDidMount() {
        const url = this.props.optionapp[0].serverUrl + "/SelectCountOrders.php";

        fetch(url, {
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
          })
        .then((response) => response.json())
        .then((responseJson) => {
            this.checkCountOrder(responseJson.orders_count);
            this.props.changeStatus({ statusCloud: 1});
        })
        .catch((error) => {
            this.props.changeStatus({ statusCloud: 0});
            console.error(error);
        });
        
    }

    checkCountOrder = (newCount) => {
        if (this.props.optionapp[0].allOrderCount !== Number(newCount)) {
            const allOrder = Number(newCount) - this.props.optionapp[0].allOrderCount + this.props.optionapp[0].newOrderCount;
            this.props.onControlOrder({
                allOrderCount: Number(newCount),
                newOrderCount: allOrder
            });
            this.setState ({playSound: true});
        }  
    }
    
    render() {

        return (
            <Fragment>
                
               { this.state.playSound ? <Sound
                url="http://mircoffee.by/deliveryserv/app/sound/new_order.mp3"
                playStatus={Sound.status.PLAYING} 
                
                 /> : null
               }
            </Fragment>
            );        
    }
}

export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
        changeStatus: (data) => {
            dispatch({ type: 'CHANGE_OPTIONAPP_CLOUD_STATUS', payload: data});
          },
    })
  )(test);
  */