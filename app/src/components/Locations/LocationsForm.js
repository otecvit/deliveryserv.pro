import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Divider, message, Switch, Modal, Col, Row, TimePicker} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment'

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}
const format = 'HH:mm';
const InputGroup = Input.Group;


class LocationsForm extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        blPickup: true,
            chPhoneLocation: this.props.param ? this.props.locations.find(x => x.idLocations ===  this.props.param).arrPhones : [{iPhone:"1", chPhone: ""}],
            arrOperationMode: this.props.param ? this.props.locations.find(x => x.idLocations ===  this.props.param).arrOperationMode :
            [
              {iDay: 0, chDay: "Понедельник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 1, chDay: "Вторник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 2, chDay: "Среда", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 3, chDay: "Четверг", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 4, chDay: "Пятница", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 5, chDay: "Суббота", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 6, chDay: "Воскресенье", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
            ],
      };
    }

   
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const {chPhoneLocation, arrOperationMode} = this.state;
            var val = {};

            const arrPhones = chPhoneLocation.map( (item, index) => {
              var newArr = {};
              newArr.iPhone= index.toString();
              newArr.chPhone = values["chPhone" + index];
              return newArr;
            });

            const OperationMode = arrOperationMode.map( (item, index) => {
              const newdata = {
                  ...item,
                  time: item.time.map( (a, indexTime, arr) => {
                  var newArr = {};
                  newArr.iTime= index.toString();
                  newArr.tStartTime = values["tStartTime" + index + indexTime].format('HH:mm');
                  newArr.tEndTime = values["tEndTime" + index + indexTime].format('HH:mm');
                  return newArr;
                })
              };
              return newdata;
            });

            if (this.props.param) {
              const url = this.props.optionapp[0].serverUrl + "/EditLocations.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  idLocations: this.props.param,
                  blShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chAddress: values.chAddressLocation,
                  arrPhones: arrPhones,
                  arrOperationMode: OperationMode,
                  blPickup: values.enPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  key: this.props.param,
                  idLocations: this.props.param,
                  blShow: values.enShow ? "true" : "false",
                  chName: values.chName,
                  chAddress: values.chAddressLocation,
                  arrPhones: arrPhones,
                  arrOperationMode: OperationMode,
                  blPickup: values.enPickup ? "true" : "false",
                }
                this.props.onEdit(val);  // вызываем action
                message.success('Ресторан изменен');
                //this.props.form.resetFields(); // ресет полей

              }).catch((error) => {
                  console.error(error);
              });
            } else {
             const urlLocation = this.props.optionapp[0].serverUrl + "/InsertLocation.php"; // изменяем категорию
              fetch(urlLocation, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  blShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chAddress: values.chAddressLocation,
                  arrPhones: arrPhones,
                  arrOperationMode: OperationMode,
                  blPickup: values.enPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  key: responseJsonFromServer.id.toString(),
                  idLocations: responseJsonFromServer.id.toString(),
                  blShow: values.enShow ? "true" : "false",
                  chName: values.chName,
                  chAddress: values.chAddressLocation,
                  arrPhones: arrPhones,
                  arrOperationMode: OperationMode,
                  blPickup: values.enPickup ? "true" : "false",
                }
                this.props.onAdd(val);  // вызываем action
                message.success('Ресторан создан'); 

                this.props.form.resetFields(); // ресет полей
                this.setState({
                  chPhoneLocation: [{iPhone:"1", chPhone: ""}],
                  arrOperationMode: 
                  [
                    {iDay: 0, chDay: "Понедельник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                    {iDay: 1, chDay: "Вторник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                    {iDay: 2, chDay: "Среда", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                    {iDay: 3, chDay: "Четверг", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                    {iDay: 4, chDay: "Пятница", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                    {iDay: 5, chDay: "Суббота", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                    {iDay: 6, chDay: "Воскресенье", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
                  ]
                })
                
              }).catch((error) => {
                  console.error(error);
              });
   
            }
          }
        });
      }

    Delete = () => {
      const url = this.props.optionapp[0].serverUrl + "/DeleteLocations.php"; // удаление
      fetch(url,
        {
            method: 'POST',
            headers: 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
              idLocations: this.props.param
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
            var val = {
              idLocations: this.props.param,
            }
            this.props.onDelete(val);  // вызываем action
        }).catch((error) =>
        {
            console.error(error);
        });
        message.success('Ресторан удален'); 
        this.props.handler();
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.param !== this.props.param) {
        this.props.form.setFieldsValue({
          'enShow': this.props.locations.find(x => x.idLocations ===  nextProps.param).blShow === "true",
          'enPickup': this.props.locations.find(x => x.idLocations ===  nextProps.param).blPickup === "true",
          'chName': this.props.locations.find(x => x.idLocations ===  nextProps.param).chName,
          'chAddressLocation': this.props.locations.find(x => x.idLocations ===  nextProps.param).chAddress,
        });
        this.setState({
          chPhoneLocation: this.props.locations.find(x => x.idLocations ===  nextProps.param).arrPhones,
          arrOperationMode: this.props.locations.find(x => x.idLocations ===  nextProps.param).arrOperationMode,
        });
      }
    }


    AddPhone = () => {
      const { chPhoneLocation } = this.state;

      const newdata = {
        iPhone: generateKey(), 
        chPhone: ""
      };

      this.setState({
        chPhoneLocation: [...chPhoneLocation, newdata]
      });       
    }

    DelPhone = (e) => {
      const { chPhoneLocation } = this.state;
      const updatedArrPhone = chPhoneLocation.filter(a => a.iPhone !== e.iPhone);
       this.setState({
        chPhoneLocation: updatedArrPhone,
      }); 
    }

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
      }); 

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
      }); 
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
      });       
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
      });       
    }

    onChangePickup = () => {
      this.setState({
        blPickup: !this.state.blPickup
      });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { chPhoneLocation, arrOperationMode, blPickup } = this.state;
        const labelColSpan = 8;

        const IconFont = Icon.createFromIconfontCN({
          scriptUrl: this.props.optionapp[0].scriptIconUrl,
        });

        const phonesLocation = chPhoneLocation.map( (item, index, arr) => {
          return (
            <Row gutter={4} key={item.iPhone} style={{ marginBottom: 0  }}>
              <Col span={7}>
              <FormItem
                         style={{ marginBottom: 0 }}
                      >
                {getFieldDecorator('chPhone' + index, {
                  initialValue: item.chPhone
                })(
                  <Input prefix={<IconFont type="icon-phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
                )}              
              </FormItem>
              </Col>
              <Col span={1} style={{ marginTop: 4  }}>
                { arr.length - 1 === index ? <Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddPhone()}/> :
                  <Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelPhone(item)}/> }
              </Col>
            </Row>);
        });
        
        const OperationMode = arrOperationMode.map( (item, index) => {
          if (!item.blDayOff)
            return item.time.map( (a, indexTime, arr) => {
              if (arr.length - 1 === indexTime) 
                return (
                  <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                    <Col span={3} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                    <Col span={3}> 
                      <FormItem
                         style={{ marginBottom: 0 }}
                      >
                        <span style={{ marginRight: 5 }}>с</span>
                        {getFieldDecorator('tStartTime' + index + indexTime, {
                          initialValue: moment(a.tStartTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width"/>
                        )}   
                      </FormItem>         
                    </Col>
                    <Col span={3}>
                      <FormItem
                        style={{ marginBottom: 0 }}
                      >
                        <span style={{ marginRight: 5 }}>по</span>
                        {getFieldDecorator('tEndTime' + index + indexTime, {
                          initialValue: moment(a.tEndTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width"/>
                        )}   
                      </FormItem>         
                    </Col>
                    <Col span={1} style={{ marginTop: 4  }}><Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddTimePeriod(item.iDay)}/></Col>
                    <Col span={2}><Button type="default" onClick = {() => this.onDayOff(item)}>Выходной</Button></Col>
                  </Row>
                ); 
              else
                return (
                  <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                    <Col span={3} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                    <Col span={3}> 
                      <FormItem
                         style={{ marginBottom: 0 }}
                      >
                        <span style={{ marginRight: 5 }}>с</span>
                        {getFieldDecorator('tStartTime' + index + indexTime, {
                          initialValue: moment(a.tStartTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width"/>
                        )}   
                      </FormItem>         
                    </Col>
                    <Col span={3}>
                      <FormItem
                        style={{ marginBottom: 0 }}
                      >
                        <span style={{ marginRight: 5 }}>по</span>
                        {getFieldDecorator('tEndTime' + index + indexTime, {
                          initialValue: moment(a.tEndTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width"/>
                        )}   
                      </FormItem>         
                    </Col>
                    <Col span={1} style={{ marginTop: 4  }}><Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelTimePeriod(item, a.iTime)}/></Col>
                    <Col span={2}></Col>
                  </Row>
                ); 
            });
          else 
            return (
              <Row gutter={4} key={index} style={{ marginBottom: 8  }} >
                <Col span={3}>{item.chDay}:</Col>
                <Col span={19}><Button type="default" onClick = {() => this.onDayWork(item)}>Рабочий день</Button></Col>
              </Row>
            );
        });
       
        return (
          <div>
            { this.props.param ? (       
            <div style={{ 
              margin: "15px 0", 
              padding: "15px 0", 
              borderTopStyle: "dashed", 
              borderTopWidth: "1px", 
              borderTopColor: "#cecece",
              borderBottomStyle: "dashed", 
              borderBottomWidth: "1px", 
              borderBottomColor: "#cecece",
               }}>
               <h4>Удалить ресторан</h4>
               <Popconfirm title="Удалить ресторан?" onConfirm={() => this.Delete()} okText="Да" cancelText="Нет">
                  <Button type="primary">
                    Удалить
                  </Button>
                </Popconfirm>
            </div>) : null
            }
            <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
            <FormItem
              label="Активность"
            >
              {getFieldDecorator('enShow', { 
                initialValue: this.props.param  ? (this.props.locations.find(x => x.idLocations ===  this.props.param).blShow === "true" ) : true,
                valuePropName: 'checked'
              })(
                <Switch />
              )}
            </FormItem>
            <FormItem
              label="Имя"
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите название' }],
                initialValue: this.props.param ? this.props.locations.find(x => x.idLocations ===  this.props.param).chName : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Название ресторана" />
              )}
            </FormItem>
            <FormItem
              label="Адрес"  
              className="content-form"
              hasFeedback
            >
              {getFieldDecorator('chAddressLocation', {
                rules: [{required: true, message: 'Заполните это поле'}],
                initialValue: this.props.param ? this.props.locations.find(x => x.idLocations ===  this.props.param).chAddress : ""
              })(
                <Input prefix={<IconFont type="icon-map-marker" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </FormItem>
            <Divider dashed />
            <div className="ant-form-item-label"><label>Номер телефона</label></div>
            {phonesLocation}
            <Divider dashed />
            <div className="ant-form-item-label"><label>Режим работы</label></div>
            {OperationMode}
            <Divider dashed />
            <FormItem
              label="Возможен самовывоз"
              className="content-form-not-required"
            >
              {getFieldDecorator('enPickup', { 
                initialValue: this.props.param  ? (this.props.locations.find(x => x.idLocations ===  this.props.param).blPickup === "true" ) : true,
                valuePropName: 'checked'
              })(
                <Switch onChange={this.onChangePickup}/>
              )}
            </FormItem>
            <FormItem
            >
              <Button type="primary" htmlType="submit">
                <Icon type="plus"/>Сохранить
              </Button>
            </FormItem>
          </Form>
        </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(LocationsForm);

export default connect (
  state => ({
      locations: state.locations,
      owner: state.owner,
      optionapp: state.optionapp,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_LOCATIONS', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_LOCATIONS', payload: data});
    },
    
    onDelete: (data) => {
      dispatch({ type: 'DELETE_LOCATIONS', payload: data});
    },
  })
)(WrappedNormalLoginForm);
