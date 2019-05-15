import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import MIDISounds from 'midi-sounds-react';

class test extends Component {

    constructor(props) {
        super(props);
        this.state = {
			selectedDrum: 21
			,drumLowTom:30
			,drumHighTom:50
			,drumSnare:15
			,drumBass:5
            ,drumCrash:70,
            currentStatus: false,
		};
        const url = this.props.optionapp[0].serverUrlStart + "/NotificationNewOrder.php?chUID=" + this.props.owner.chUID + "&CountOrder=" + this.props.owner.CountOrder;
        this.eventSource = new EventSource(url);
        
    }

    playTestInstrument = () => {
        var when=this.midiSounds.contextTime();
		var b=0.1;
		this.midiSounds.playChordAt(when+b*0,594,[60],b*1);
		this.midiSounds.playChordAt(when+b*3,594,[56],b*4);
    }

    newEventSource = () => {
        // закрываем соединение
        this.eventSource.close();
        delete this.eventSource;
        /// делаем новое
        const url = this.props.optionapp[0].serverUrlStart + "/NotificationNewOrder.php?chUID=" + this.props.owner.chUID + "&CountOrder=" + this.props.owner.CountOrder;
        this.eventSource = new EventSource(url);
        this.subscribeToServerEvent();
    }
    

    componentDidMount() {
        this.subscribeToServerEvent();
    }

    subscribeToServerEvent = () => {

       this.eventSource.onmessage = e => {
          try {
            
              // если получено сообщение значит пришел новый заказ
              // меняем общее значение заказов (CountOrder) и изменяем количество новых заказов, выводим сообщение и проигрываем звук
              this.props.onNewOrder({
                CountOrder: e.data,
                NewOrderPrint: (Number(e.data) - Number(this.props.owner.CountOrder) + Number(this.props.owner.NewOrderPrint)).toString(),
             });
             this.playTestInstrument();
             this.newEventSource();

          } catch (e) {
            console.log('error parsing server response', e)
          }
        }
    }

    handlePlay() {
		this.audio.play();
	}

    render() {
        return (
                <Fragment>
                    <div style={{display: 'none'}}>
                        <MIDISounds ref={(ref) => (this.midiSounds = ref)}  appElementName="root" instruments={[594]} drums={[this.state.selectedDrum,this.state.drumLowTom,this.state.drumHighTom,this.state.drumSnare,this.state.drumBass,this.state.drumCrash]} />
                    </div>
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

