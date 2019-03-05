import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Divider, message, Switch, Tooltip, Col, Row, TimePicker} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment'

import PhonesLocation from '../../items/PhonesLocation'
import OperationMode from '../../items/OperationMode'

const FormItem = Form.Item;

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

            
            const OperationMode = arrOperationMode.map( (item, index) => {
              const newdata = {
                  ...item,
                  time: item.time.map( (a, indexTime, arr) => {
                  var newArr = {};
                  newArr.iTime= indexTime.toString();
                  newArr.tStartTime = a.tStartTime;
                  newArr.tEndTime = a.tEndTime;
                  return newArr;
                })
              };
              return newdata;
            });
            
            /*
            console.log({
              idLocations: this.props.param,
              blShow: values.enShow ? "1" : "0",
              chName: values.chName,
              chAddress: values.chAddressLocation,
              arrPhones: arrPhones,
              blPickup: values.enPickup ? "1" : "0",
              arrOperationMode: OperationMode,
            });
            */

            
            if (this.props.type === '1') {

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
                  idLocations: this.props.param.idLocations,
                  blShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chAddress: values.chAddressLocation,
                  arrPhones: arrPhones,
                  arrOperationMode: OperationMode,
                  blPickup: values.enPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  key: this.props.param.idLocations,
                  idLocations: this.props.param.idLocations,
                  blShow: values.enShow ? "true" : "false",
                  chName: values.chName,
                  chAddress: values.chAddressLocation,
                  arrPhones: arrPhones,
                  arrOperationMode: OperationMode,
                  blPickup: values.enPickup ? "true" : "false",
                }
                this.props.onEdit(val);  // вызываем action
                message.success('Ресторан изменен');

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

                if (responseJsonFromServer.status) {
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

                  this.props.form.setFieldsValue({
                    'enShow': true,
                    'chName': '',
                    'chAddressLocation': '',
                    'enPickup': true,
                  });

                  this.setState({
                    chPhoneLocation: defaultArrPhones,
                    arrOperationMode: defaultOperationMode,
                  })
                }
                
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
              idLocations: this.props.param.idLocations
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
            var val = {
              idLocations: this.props.param.idLocations,
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
        if (nextProps.type === "0") {
          this.props.form.setFieldsValue({
            'enShow': true,
            'chName': '',
            'chAddressLocation': '',
            'enPickup': true,
          });
        
          this.setState({
            chPhoneLocation: defaultArrPhones,
            arrOperationMode: defaultOperationMode,
          });
        }

        if (nextProps.type === "2" || nextProps.type === "1") {
          this.props.form.setFieldsValue({
            'enShow': nextProps.param.blShow === "true",
            'chName': nextProps.param.chName + `${nextProps.type === "2" ? " - Копия" : "" }`,
            'chAddressLocation': nextProps.param.chAddress,
            'enPickup': nextProps.param.blPickup === "true",
          });

          this.setState({
            chPhoneLocation: nextProps.param.arrPhones,
            arrOperationMode: nextProps.param.arrOperationMode,
          });
        }
      }

    }
   
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
        const { chPhoneLocation, arrOperationMode } = this.state;
        const labelColSpan = 8;
 
        const IconFont = Icon.createFromIconfontCN({
          scriptUrl: this.props.optionapp[0].scriptIconUrl,
        });

             
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
               <h4>Удалить адрес</h4>
               <Popconfirm title="Удалить адрес?" onConfirm={() => this.Delete()} okText="Да" cancelText="Нет">
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
                initialValue: this.props.type !== "0" ? this.props.param.chName + `${this.props.type === "2" ? " - Копия" : "" }` : ""
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
            <PhonesLocation arrPhones = {chPhoneLocation} updateData={this.updateArrPhone}/>
            <Divider dashed />
            <div className="ant-form-item-label">
              <label>
                    Режим работы&nbsp;
                    <Tooltip title="Укажите режим работы. В приложении появится уведомление в случае попытки заказа в нерабочее время.">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
              </label>
            </div>
            <OperationMode arrOperationMode = {arrOperationMode} updateData={this.updateArrOperationMode}/>
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
