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


    newEventSource = () => {
        // закрываем соединение
        this.eventSource.close();
        delete this.eventSource;
        /// делаем новое
        const url = this.props.optionapp[0].serverUrlStart + "/NotificationNewOrder.php?chUID=" + this.props.owner.chUID + "&CountOrder=" + this.props.owner.CountOrder;
        this.eventSource = new EventSource(url);
        this.subscribeToServerEvent();
        console.log(url);
        
    }
    

    componentDidMount() {
        this.subscribeToServerEvent();
    }

    subscribeToServerEvent = () => {
        
        this.setState({
            playSound: false,
        })

        this.eventSource.onmessage = e => {
          try {
              // если получено сообщение значит пришел новый заказ
              // меняем общее значение заказов (CountOrder) и изменяем количество новых заказов, выводим сообщение и проигрываем звук
              console.log(e.data);

              this.props.onNewOrder({
                CountOrder: e.data,
                NewOrderPrint: (Number(e.data) - Number(this.props.owner.CountOrder) + Number(this.props.owner.NewOrderPrint)).toString(),
             });

              this.setState({
                  playSound: true,
              })

              this.newEventSource();

          } catch (e) {
            console.log('error parsing server response', e)
          }
        }
    }

    render() {
        return (<Fragment>
             { this.state.playSound && <Sound url="http://mircoffee.by/deliveryserv/app/sound/new_order.mp3" playStatus={Sound.status.PLAYING} /> }
        </Fragment>)
    }
}


export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onNewOrder: (data) => {
            dispatch({ type: 'EDIT_NEW_ORDER_FOR_PRINT', payload: data});
          },        
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