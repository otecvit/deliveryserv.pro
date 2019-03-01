import React, { Component, Fragment } from 'react'
import { Row, Col, Button, TimePicker } from 'antd'
import moment from 'moment'

const format = 'HH:mm';

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }
 
class OperationMode extends Component {
    
    state = {
        arrOperationMode: this.props.arrOperationMode,
    }

    /*
    timeRefStart = this.props.arrOperationMode.map( item => {
        if (!item.blDayOff)
            item.time.map(React.createRef());
        }
    );

    timeRefEnd = this.props.arrOperationMode.map( item => {
        if (!item.blDayOff)
            item.time.map(React.createRef());
        }
    );
    */

    AddTimePeriod =(e) => {
        const { arrOperationMode } = this.state;
  
        const updatedArrOperationMode = arrOperationMode.map(item => {
          if(item.iDay === e){
            item.time.push({
              iTime: generateKey(),
              tStartTime: "10:00", 
              tEndTime: "22:00", 
            });
          }
          return item;
        });
  
        this.setState({
          arrOperationMode: updatedArrOperationMode,
        }, this.updateParrent(updatedArrOperationMode)); 
  
    }
  
    DelTimePeriod = (e, iDelTime) => {
        const { arrOperationMode } = this.state;
        const updatedArrOperationMode = arrOperationMode.map(item => {
          if(item.iDay === e.iDay){
            const time = e.time.filter(a => a.iTime !== iDelTime );
            return {...item, time}
          }
          return item;
        });
  
        this.setState({
          arrOperationMode: updatedArrOperationMode,
        }, this.updateParrent(updatedArrOperationMode)); 
    }
  
    onDayOff = (e) => {
        const { arrOperationMode } = this.state;
        const updatedArrOperationMode = arrOperationMode.map(item => {
          if(item.iDay === e.iDay){
            const newdata = {
              iDay: e.iDay, 
              chDay: e.chDay, 
              blDayOff: true, 
              time: [] 
            };
            return newdata;
          }
          return item;
        });
  
        this.setState({
          arrOperationMode: updatedArrOperationMode,
        }, this.updateParrent(updatedArrOperationMode));       
    }
  
    onDayWork = (e) => {
        const { arrOperationMode } = this.state;
        
        const updatedArrOperationMode = arrOperationMode.map(item => {
          if(item.iDay === e.iDay){
            const newdata = {
              iDay: e.iDay, 
              chDay: e.chDay, 
              blDayOff: false, 
              time: [{ iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }],
            };
            return newdata;
          }
          return item;
        });
  
        this.setState({
          arrOperationMode: updatedArrOperationMode,
        }, this.updateParrent(updatedArrOperationMode));       
    }

    // Обработка ввода номера и добавление в state
    handleChange = (time, timeString, a, b) => {
        console.log(timeString);
        console.log('--->>', a);
        console.log('+++>>', b);
        
        /*
        const { chPhoneLocation } = this.state;
        const iPhone = target.getAttribute('data-item');
        const arrPhone = { 
          iPhone: iPhone, 
          chPhone: target.value 
        };
        const updatedArrPhone = chPhoneLocation.map(item => item.iPhone === iPhone ?  arrPhone : item);
  
        this.setState({
          chPhoneLocation: updatedArrPhone
        }, this.updateParrent(updatedArrPhone))
        */
    }

    // Вызываем callback функцию родителя
    updateParrent = (updatedArrPhone) => {
        this.props.updateData(updatedArrPhone)
    }

    render() {
        const { arrOperationMode } = this.state;

        const OperationMode = arrOperationMode.map( (item, index) => {
            if (!item.blDayOff)
                return item.time.map( (a, indexTime, arr) => {
                if (arr.length - 1 === indexTime) 
                    return (
                    <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                        <Col span={4} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                        <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>с</span></Col>
                        <Col span={5}> 
                             <TimePicker value = {moment(a.tStartTime, format)} format={format} className="time-picker-width" onChange={(time, timeString) => this.handleChange(time, timeString, index, indexTime)}/>
                        </Col>
                        <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>по</span></Col>
                        <Col span={5}>
                             <TimePicker value={moment(a.tEndTime, format)} format={format} className="time-picker-width"  onChange={this.handleChange}/>
                        </Col>
                        <Col span={1} style={{ marginTop: 4  }}><Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddTimePeriod(item.iDay)}/></Col>
                        <Col span={2}><Button type="default" onClick = {() => this.onDayOff(item)}>Выходной</Button></Col>
                    </Row>
                    ); 
                else
                    return (
                    <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                        <Col span={4} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                        <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>с</span></Col>
                        <Col span={5}> 
                            <TimePicker value={moment(a.tStartTime, format)} format={format} className="time-picker-width" onChange={this.handleChange}/>
                        </Col>
                        <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>по</span></Col>
                        <Col span={5}>
                           <TimePicker value={moment(a.tEndTime, format)} format={format} className="time-picker-width" onChange={this.handleChange}/>
                        </Col>
                        <Col span={1} style={{ marginTop: 4  }}><Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelTimePeriod(item, a.iTime)}/></Col>
                        <Col span={2}></Col>
                    </Row>
                    ); 
                });
            else {
                return (
                <Row gutter={4} key={index} style={{ marginBottom: 8  }} >
                    <Col span={5} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                    <Col span={19}><Button type="default" onClick = {() => this.onDayWork(item)}>Рабочий день</Button></Col>
                </Row>
                );
            }
        });


        return (
            <Fragment>
                {OperationMode}
            </Fragment> 
        );
    }
}

export default OperationMode;