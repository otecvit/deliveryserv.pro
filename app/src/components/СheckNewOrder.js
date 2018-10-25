import React, { Component } from 'react'
import { connect } from 'react-redux';
import Sound from 'react-sound';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd';


const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

class test extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            playSound: false,
        }
      
    }

    componentDidMount() {
        //const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "http://mircoffee.by/deliveryserv/app/SelectCountOrders.php";

        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            this.checkCountOrder(responseJson.orders_count);
        })
        .catch((error) => {
          console.error(error);
        });
       
        
    }

    checkCountOrder = (newCount) => {
        console.log(this.props.optionapp[0].newOrderCount);
        if (this.props.optionapp[0].newOrderCount !== newCount) {
            this.props.onControlOrder({newOrderCount: newCount});
            this.setState ({playSound: true});
        }  
    }
    
    render() {

        return (
            <div>
               { this.state.playSound ? <Sound
                url="http://mircoffee.by/deliveryserv/app/sound/new_order.mp3"
                playStatus={Sound.status.PLAYING} 
                 /> : null
               }
            </div>
            );        
    }
}

export default connect (
    state => ({
        optionapp: state.optionapp,
    }),
    dispatch => ({
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
    })
  )(test);