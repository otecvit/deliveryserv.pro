import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider, Tooltip, Steps, Select, Switch, Row, Col, TimePicker } from 'antd'
import { Link } from 'react-router-dom'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import Cookies from 'js-cookie'

import TariffPlans, { Tariffs } from '../items/TariffPlans'
import PhonesLocation from '../items/PhonesLocation'
import OperationMode from '../items/OperationMode'
import { timezones, money } from '../constans'

const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;

  const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }
      
class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            currentTarif: "1",
            currentPeriodMonth: true,
            chName: "",
            chTagline: "",
            chEmailStore: "",
            chTimeZone: "Europe/Moscow",
            chCurrency: "₽",
            chNameLocation: "",
            chAddressLocation: "",
            blPickup: true,
            chPhoneLocation: [{iPhone:"1", chPhone: ""}],
            arrOperationMode: [
              {iDay: 0, chDay: "Понедельник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 1, chDay: "Вторник", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 2, chDay: "Среда", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 3, chDay: "Четверг", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 4, chDay: "Пятница", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 5, chDay: "Суббота", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
              {iDay: 6, chDay: "Воскресенье", blDayOff: false, time: [ { iTime: "1", tStartTime: "10:00", tEndTime: "22:00" }] },
            ],
            SetupSuccessful: false,
         };
    }

    handleStep_1 = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            this.setState({
              currentStep: 1,
              chName: values.chName,
              chTagline: values.chTagline,
              chEmailStore: values.chEmailStore,
              chTimeZone: values.chTimeZone,
              chCurrency: values.chCurrency,
            });
         }
      });
    }

    handleTariff = (tariff) => {
      this.setState({
          currentTarif: Tariffs[Tariffs.findIndex(x => x.idTarif === tariff)].idTarif,
      })
    }

    handleStep_2 = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            const {chPhoneLocation, arrOperationMode} = this.state;


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

            this.setState({
              currentStep: 2,
              chNameLocation: values.chNameLocation,
              chAddressLocation: values.chAddressLocation,
              chPhoneLocation: arrPhones,
              arrOperationMode: OperationMode,
            });
         }
      });
    }

    next = () => {
        const currentStep = this.state.currentStep + 1;
        this.setState({
          currentStep: currentStep
        })
      }

    prevStep = () => {
      const form = this.props.form;
      const currentStep = this.state.currentStep - 1;
      this.setState({
        currentStep: currentStep,
      })

      
      if (this.state.currentStep == 1)
        this.setState({
          chNameLocation: form.getFieldValue('chNameLocation'),
          chAddressLocation: form.getFieldValue('chAddressLocation'),
          chPhoneLocation: this.state.chPhoneLocation.map( (item, index) => {
            var newArr = {};
            newArr.iPhone= index.toString();
            newArr.chPhone = form.getFieldValue("chPhone" + index);
            return newArr;
          }),
        })
      
    }

    onChangeTimeZone = (e) => {
      this.setState({
        chTimeZone: e,
      })
    }

    onChangeCurrency = (e) => {
      this.setState({
        chCurrency: e,
      })
    }

    

    onChangeTarif = (e) => {
      this.setState({
        currentTarif: e,
      })      
    }

    changePeriod = () => {
      this.setState({
        currentPeriodMonth: !this.state.currentPeriodMonth
      })
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

    onChangePickup = () => {
      this.setState({
        blPickup: !this.state.blPickup
      });
    }

    updateArrOperationMode = (value) => {
      this.setState({ arrOperationMode: value })
     }

    saveSetup = () => {
      
      //var val={};
      const { chName, chEmailStore, chTimeZone, chCurrency, chNameLocation, chAddressLocation, chPhoneLocation, blPickup, arrOperationMode } = this.state;

      var val = {};

      const url = this.props.optionapp[0].serverUrl + "/SaveSetup.php"; // сохраняем настройки
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  chName: chName,
                  chEmailStore: chEmailStore,
                  iTarif: "0",
                  chTimeZone: chTimeZone,
                  chCurrency: chCurrency,
                  blPickup: blPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  chUID: this.props.owner.chUID,
                  chName: chName,
                  chEmailStore: chEmailStore,
                  iTarif: "0",
                  chTimeZone: chTimeZone,
                  chCurrency: chCurrency,
                  blVerification: "0",
                  blPickup: blPickup ? "1" : "0",
                }
                this.props.onEdit(val);  // вызываем action
                this.setState ({
                  SetupSuccessful: true,
                });
              }).catch((error) => {
                this.setState ({
                  SetupSuccessful: false,
                });
                console.error(error);
              });
          
          // отправляем письмо с подтверждением email
          const urlSendMailAct = this.props.optionapp[0].serverUrl + "/SendMailAct.php"; // изменяем категорию
              fetch(urlSendMailAct, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUIDStaff: this.props.owner.chUIDStaff,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                  
                  
              }).catch((error) => {
                  console.error(error);
              });

          const urlLocation = this.props.optionapp[0].serverUrl + "/InsertLocation.php"; // изменяем категорию
              
              fetch(urlLocation, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  blShow: "1",
                  chName: chNameLocation,
                  chAddress: chAddressLocation,
                  arrPhones: chPhoneLocation,
                  arrOperationMode: arrOperationMode,
                  blPickup: blPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {

              }).catch((error) => {
                  console.error(error);
              });
          
    }

    updateArrPhone = (value) => {
      this.setState({ chPhoneLocation: value })
   }

    // выход из регистрации
    onExit = () => {

      const url = `${this.props.optionapp[0].serverUrl}/DeleteOwner.php`; // удаление
      fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(
            {
              idCustomer: this.props.owner.idCustomer
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
          // удаляяем куки
          Cookies.remove('cookiename');
          // очищаем редюсер
          this.props.onLogout(); // выход
        }).catch((error) =>
        {
            console.error(error);
        });
   
    }


    render() {

      const { currentStep, chName, chTagline, chTimeZone, chCurrency, chEmailStore, chNameLocation, chPhoneLocation, chAddressLocation, currentTarif, currentPeriodMonth, arrOperationMode, blPickup, SetupSuccessful } = this.state;
      const { getFieldDecorator } = this.props.form;

      const IconFont = Icon.createFromIconfontCN({
        scriptUrl: this.props.optionapp[0].scriptIconUrl,
      });

      const options = timezones.map(item => <Option value={item.name} key={item.name}>{item.value}</Option>);
      const optionsMoney = money.map(item => <Option value={item.value} key={item.value}>{item.name} - {item.value}</Option>)
     
      const phonesLocation = chPhoneLocation.map( (item, index, arr) => {
        return (
          <Row gutter={4} key={item.iPhone} style={{ marginBottom: 0  }}>
            <Col span={22}>
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
            <Col span={2} style={{ marginTop: 8, paddingBottom: 7, paddingLeft: 5 }}>
              { arr.length - 1 === index ? <Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddPhone()}/> :
                <Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelPhone(item)}/> }
            </Col>
          </Row>);
      });
      

    if ((SetupSuccessful) || (typeof this.props.owner.chUID === "undefined")) {
      return <Redirect to="/"/>
    }

    return (
        <Modal
          title="Настройка"
          style={{ top: 20 }}
          visible={true}
          maskStyle={{backgroundColor: '#f2f2f2'}}
          footer=""
          width='600px'
          className="form-login"
        >
          <Steps current = {currentStep}>
          <Step key="1"/>
          <Step key="2"/>
          <Step key="3"/>
          </Steps>
          { currentStep === 0 && 
            <Form onSubmit={this.handleStep_1}>
              <Row>
                <Col span={16}>
                  <div className="title-setup">
                    Базовые настройки
                  </div>
                  <div className="describe-setup">
                    Вы всегда сможете изменить данную информацию
                  </div>
                </Col>
                <Col span={8}>
                  <div className="title-setup" style={{textAlign: "right"}}>
                    <Button type="dashed" onClick={() => this.onExit()} style = {{ padding: '0 20px'}}>
                        Выход
                    </Button>
                  </div>
                </Col>
              </Row>
              <Divider dashed />
              <FormItem
                label={
                  <span>
                      Наименование организации&nbsp;
                      <Tooltip title="Укажите юридическое наименование организации. При желании можно указать название торговой марки или бренда.">
                          <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                      </Tooltip>
                  </span>
                }
                className="content-form"
                hasFeedback
              >
                {getFieldDecorator('chName', {
                  rules: [{required: true, message: 'Заполните это поле'}],
                  initialValue: chName.length ? chName : ""
                })(
                  <Input prefix={<IconFont type="icon-shop1170559easyiconnet" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                )}
              </FormItem>
              <Divider dashed />
              <FormItem
                label="E-mail организации (необязательно)"  
                hasFeedback
                className="content-form-not-required" 
              >
                {getFieldDecorator('chEmailStore', {
                  rules: [{type: 'email', message: 'Некорректный формат E-mail'}],
                  initialValue: chEmailStore.length ? chEmailStore : ""
                })(
                  <Input prefix={<IconFont type="icon-emailicon" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
                )}
              </FormItem>
              <Divider dashed />
              <FormItem 
                label="Часовой пояс"
                hasFeedback
                className="content-form"
              >
                {getFieldDecorator('chTimeZone', {
                  rules: [{required: true, message: 'Выберите часовой пояс' }],
                  initialValue: chTimeZone,
                })(
                  <Select
                      showSearch
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={this.onChangeTimeZone}
                      >
                      {options}
                  </Select>
                )}
              </FormItem>
              <Divider dashed />
                    <FormItem 
                        label="Валюта"
                        hasFeedback
                        className="content-form"
                        >
                        {getFieldDecorator('chCurrency', {
                            rules: [{ required: true, message: 'Выберите валюту' }],
                            initialValue: chCurrency,
                        })(
                            <Select
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={this.onChangeCurrency}
                                >
                                {optionsMoney}
                            </Select>
                    )}
                    </FormItem>
                    <Divider dashed />
                    <FormItem>
                    <Button type="primary" htmlType="submit" className="button-login">
                        Продолжить
                    </Button>
                    </FormItem>
            </Form>}
          { currentStep === 1 && 
            <Form onSubmit={this.handleStep_2}>
            <Row>
              <Col span={16}>
                <div className="title-setup">
                  Добавьте Ваш первый объект
                </div>
                <div className="describe-setup">
                  Вы сможете добавить больше торговых объектов позже
                </div>
              </Col>
              <Col span={4}>
                <div className="title-setup" style={{textAlign: "right"}}>
                  <Button type="default" onClick={() => this.prevStep()} style = {{ padding: '0 20px'}}>
                      Назад
                  </Button>
                </div>
              </Col>
              <Col span={4}>
                <div className="title-setup" style={{textAlign: "right"}}>
                  <Button type="dashed" onClick={() => this.onExit()} style = {{ padding: '0 20px'}}>
                      Выход
                  </Button>
                </div>
              </Col>
            </Row>
            <Divider dashed />
            <FormItem
              label={
                <span>
                    Наименование торгового объекта&nbsp;
                    <Tooltip title="Укажите наименование торгового объекта. При желании можно также указать название торговой марки или бренда. Информация будет доступно только Вам">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              className="content-form"
              hasFeedback
            >
              {getFieldDecorator('chNameLocation', {
                rules: [{required: true, message: 'Заполните это поле'}],
                initialValue: chNameLocation.length ? chNameLocation : ""
              })(
                <Input prefix={<IconFont type="icon-shop1170559easyiconnet" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </FormItem>
            <Divider dashed />
            <FormItem
              label={
                <span>
                    Адрес&nbsp;
                    <Tooltip title="Укажите адрес торгового объекта, пункта самовывоза или юридический адрес организации. Дополнительные адреса можно добавить позже. Информация будет доступна клиентам.">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>                
              }
              className="content-form"
              hasFeedback
            >
              {getFieldDecorator('chAddressLocation', {
                rules: [{required: true, message: 'Заполните это поле'}],
                initialValue: chAddressLocation.length ? chAddressLocation : ""
              })(
                <Input prefix={<IconFont type="icon-map-marker" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </FormItem>
            <Divider dashed />
              <div className="ant-form-item-label" style = {{ lineHeight: '19px', marginBottom: '3px' }}>
                <label>
                  <span>
                      Номер телефона (необязательно)&nbsp;
                      <Tooltip title="Укажите номер телефона торгового объекта, либо единый номер. Дополнительные телефоны можно добавить позже. Информация будет доступна клиентам.">
                          <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                      </Tooltip>
                  </span>                
                </label></div>
              {/*phonesLocation*/}
              <PhonesLocation arrPhones = {chPhoneLocation} updateData={this.updateArrPhone}/>
            <Divider dashed />
            <div className="ant-form-item-label"><label>Режим работы</label></div>
              {/*OperationMode*/}
              <OperationMode arrOperationMode = {arrOperationMode} updateData={this.updateArrOperationMode}/>
            <Divider dashed />
            <FormItem
              label="Возможен самовывоз"
              className="content-form-not-required"
            >
              {getFieldDecorator('enPickup', { 
                initialValue: blPickup,
                valuePropName: 'checked'
              })(
                <Switch onChange={this.onChangePickup}/>
              )}
            </FormItem>
            <Divider dashed />
            <FormItem>
              <Button type="primary" htmlType="submit" className="button-login">
                  Продолжить
              </Button>
            </FormItem>
          </Form> 
          }
          { currentStep === 2 && 
            <Form>
            <Row>
              <Col span={16}>
                <div className="title-setup">
                  Выберите тарифный план
                </div>
              </Col>
              <Col span={4}>
                <div className="title-setup" style={{textAlign: "right"}}>
                  <Button type="default" onClick={() => this.prevStep()} style = {{ padding: '0 20px'}}>
                      Назад
                  </Button>
                </div>
              </Col>
              <Col span={4}>
                <div className="title-setup" style={{textAlign: "right"}}>
                  <Button type="dashed" onClick={() => this.onExit()} style = {{ padding: '0 20px'}}>
                      Выход
                  </Button>
                </div>
              </Col>
            </Row>
            <Divider dashed />
            <TariffPlans onSelectTariff = {this.handleTariff} currentTariff = {currentTarif} />
            <Divider dashed />
            <FormItem>
              <Button type="primary" htmlType="submit" className="button-login" onClick={this.saveSetup}>
                <IconFont type="icon-rocket" style={{ color: 'rgba(255, 255, 255, 1)' }} />Готово
              </Button>
            </FormItem>
          </Form> 
          
          }
          <p className="text-login-copyright">Deliveryserv © 2019 - <Link to="">Условия использования</Link></p>
        </Modal>
        );
    }
}
const LoginForm = Form.create()(Setup);

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
        onEdit: (data) => {
            dispatch({ type: 'EDIT_OWNER', payload: data});
          },
        onLogout: () => {
            dispatch({ type: 'LOGOUT_OWNER'});
          },
    }
))(LoginForm)