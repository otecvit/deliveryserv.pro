import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Divider, message, Switch, Tooltip, Col, Row, TimePicker} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment'

import PhonesLocation from '../../items/PhonesLocation'
import OperationMode from '../../items/OperationMode'


const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}
const format = 'HH:mm';
const InputGroup = Input.Group;

const defaultOperationMode = [
  {iDay: 0, chDay: "Понедельник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
  {iDay: 1, chDay: "Вторник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
  {iDay: 2, chDay: "Среда", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
  {iDay: 3, chDay: "Четверг", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
  {iDay: 4, chDay: "Пятница", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
  {iDay: 5, chDay: "Суббота", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
  {iDay: 6, chDay: "Воскресенье", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
];

const defaultArrPhones = [{iPhone:"1", chPhone: ""}];


class LocationsForm extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        blPickup: true,
        chPhoneLocation: this.props.type !== "0" ? this.props.param.arrPhones : defaultArrPhones,
        arrOperationMode: this.props.type !== "0" ? this.props.param.arrOperationMode : defaultOperationMode,
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
              newArr.chPhone = item.chPhone;
              return newArr;
            });

            /*
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
            */

            console.log({
              idLocations: this.props.param,
              blShow: values.enShow ? "1" : "0",
              chName: values.chName,
              chAddress: values.chAddressLocation,
              arrPhones: arrPhones,
              blPickup: values.enPickup ? "1" : "0",
            });
            

            /*
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
                  arrOperationMode: defaultOperationMode,
                })
                
              }).catch((error) => {
                  console.error(error);
              });
   
            }
            */
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

      if (nextProps.type === "2") {
        this.setState({
          chPhoneLocation: nextProps.param.arrPhones,
        });
      }


   
      
      if((nextProps.param !== this.props.param)&&(nextProps.type === "1")) {
        /*
        this.props.form.setFieldsValue({
          'enShow': nextProps.blShow === "true",
          'enPickup': nextProps.blPickup === "true",
          'chName': nextProps.chName,
          'chAddressLocation': nextProps.chAddress,
        });
        */
        console.log('componentWillReceiveProps');


        this.setState({
          chPhoneLocation: nextProps.param.arrPhones,
          arrOperationMode: nextProps.param.arrOperationMode,
        });
      }
      
      
    }

    /*
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
    */

    onChangePickup = () => {
      this.setState({
        blPickup: !this.state.blPickup
      });
    }

    updateArrPhone = (value) => {
      this.setState({ chPhoneLocation: value })
   }

   updateArrOperationMode = (value) => {
    this.setState({ arrOperationMode: value })
   }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { chPhoneLocation, arrOperationMode, blPickup } = this.state;
        const labelColSpan = 8;

        const IconFont = Icon.createFromIconfontCN({
          scriptUrl: this.props.optionapp[0].scriptIconUrl,
        });

        /*
        const OperationMode = arrOperationMode.map( (item, index) => {
          if (!item.blDayOff)
            return item.time.map( (a, indexTime, arr) => {
              if (arr.length - 1 === indexTime) 
                return (
                  <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                    <Col span={4} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                    <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>с</span></Col>
                    <Col span={5}> 
                      <FormItem
                         style={{ marginBottom: 0 }}
                      >
                        
                        {getFieldDecorator('tStartTime' + index + indexTime, {
                          rules: [{ required: true, message: 'Обязательное поле' }],
                          initialValue: moment(a.tStartTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width"/>
                        )}   
                      </FormItem>         
                    </Col>
                    <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>по</span></Col>
                    <Col span={5}>
                      <FormItem
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('tEndTime' + index + indexTime, {
                          rules: [{ required: true, message: 'Обязательное поле' }],
                          initialValue: moment(a.tEndTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width" />
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
                    <Col span={4} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                    <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>с</span></Col>
                    <Col span={5}> 
                      <FormItem
                         style={{ marginBottom: 0 }}
                      >
                        
                        {getFieldDecorator('tStartTime' + index + indexTime, {
                          rules: [{ required: true, message: 'Обязательное поле' }],
                          initialValue: moment(a.tStartTime, format)
                        })(
                          <TimePicker format={format} className="time-picker-width"/>
                        )}   
                      </FormItem>         
                    </Col>
                    <Col span={1} style={{ textAlign: 'right', marginTop: 6  }}><span>по</span></Col>
                    <Col span={5}>
                      <FormItem
                        style={{ marginBottom: 0 }}
                      >
                        
                        {getFieldDecorator('tEndTime' + index + indexTime, {
                          rules: [{ required: true, message: 'Обязательное поле' }],
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
                <Col span={5} style={{ marginTop: 6  }}>{item.chDay}:</Col>
                <Col span={19}><Button type="default" onClick = {() => this.onDayWork(item)}>Рабочий день</Button></Col>
              </Row>
            );
        });
         */
       
        return (
          <div>
            { this.props.type === "1" ? (       
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
              label={
                <span>
                    Активность&nbsp;
                    <Tooltip title="Адрес будет отображаться в приложении и учавствует в работе системы">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('enShow', { 
                initialValue: this.props.type !== "0"  ? this.props.param.blShow === "true" : true,
                valuePropName: 'checked'
              })(
                <Switch />
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                    Имя&nbsp;
                    <Tooltip title="Укажите название. Эта информация не доступна в приложении. Резрешено продублировать адрес">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите имя' }],
                initialValue: this.props.type !== "0" ? this.props.param.chName : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Имя" maxLength="100"/>
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                    Адрес&nbsp;
                    <Tooltip title="Укажите адрес. Эта информация доступна в приложении">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }  
              className="content-form"
              hasFeedback
            >
              {getFieldDecorator('chAddressLocation', {
                rules: [{required: true, message: 'Заполните это поле'}],
                initialValue: this.props.type !== "0" ? this.props.param.chAddress : ""
              })(
              <Input prefix={<IconFont type="icon-map-marker" style={{ color: 'rgba(0,0,0,.25)' }}/>}  placeholder="Адрес"  maxLength="100" />
              )}
            </FormItem>
            <Divider dashed />
            <div className="ant-form-item-label">
              <label>
                    Номер телефона&nbsp;
                    <Tooltip title="Укажите необходимое количество телефонных номеров">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
              </label>
            </div>
            <PhonesLocation arrPhones = {this.props.type !== "0" ? chPhoneLocation : defaultArrPhones } updateData={this.updateArrPhone}/>
            <Divider dashed />
            <div className="ant-form-item-label">
              <label>
                    Режим работы&nbsp;
                    <Tooltip title="Укажите режим работы. В приложении появится уведомление в случае попытки заказа в нерабочее время.">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
              </label>
            </div>
            <OperationMode arrOperationMode = {this.props.type !== "0" ? arrOperationMode : defaultOperationMode } updateData={this.updateArrOperationMode}/>
            <Divider dashed />
            <FormItem
              label={
                <span>
                    Возможен самовывоз&nbsp;
                    <Tooltip title="По данному адресу можно осуществлять самовывоз заказа">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              className="content-form-not-required"
            >
              {getFieldDecorator('enPickup', { 
                initialValue: this.props.type !== "0" ? this.props.param.blPickup === "true"  : true,
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
