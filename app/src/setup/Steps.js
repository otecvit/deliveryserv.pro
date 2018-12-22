import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider, message, Steps, Select, Switch, Row, Col, TimePicker } from 'antd'
import { Link } from 'react-router-dom'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'



const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;
const format = 'HH:mm';

//const chUID = "222333";

const timezones = [
  { name: 'Europe/Warsaw',      value: "(GMT+01:00) Варшава"},
  { name: 'Europe/Kiev',        value: "(GMT+02:00) Киев"},
  { name: 'Europe/Riga',        value: "(GMT+02:00) Рига"},
  { name: 'Europe/Tallinn',     value: "(GMT+02:00) Таллин"},
  { name: 'Europe/Vilnius',     value: "(GMT+02:00) Вильнюс"},
  { name: 'Europe/Minsk',       value: "(GMT+03:00) Минск"},
  { name: 'Europe/Moscow',      value: "(GMT+03:00) Москва"},
  { name: 'Asia/Baku',          value: "(GMT+04:00) Баку"},
  { name: 'Europe/Volgograd',   value: "(GMT+04:00) Волгоград"},
  { name: 'Asia/Tbilisi',       value: "(GMT+04:00) Тбилиси"},
  { name: 'Asia/Yerevan',       value: "(GMT+04:00) Ереван"},
  { name: 'Asia/Tashkent',      value: "(GMT+05:00) Ташкент"},
  { name: 'Asia/Yekaterinburg', value: "(GMT+06:00) Екатеринбург"},
  { name: 'Asia/Almaty',        value: "(GMT+06:00) Алматы"},
  { name: 'Asia/Novosibirsk',   value: "(GMT+07:00) Новосибирск"},
  { name: 'Asia/Krasnoyarsk',   value: "(GMT+08:00) Красноярск"},
  { name: 'Asia/Ulaanbaatar',   value: "(GMT+08:00) Улан-Батор"},
  { name: 'Asia/Irkutsk',       value: "(GMT+09:00) Иркутск"},
  { name: 'Asia/Yakutsk',       value: "(GMT+10:00) Якутск"},
  { name: 'Asia/Vladivostok',   value: "(GMT+11:00) Владивосток"},
  { name: 'Asia/Magadan',       value: "(GMT+12:00) Магадан"},
];

const money = [
  { name: 'Российский рубль - RUB',       value: "₽"},
  { name: 'Украинская гривна - UAH',      value: "₴"},
  { name: 'Белорусский рубль - BYN',      value: "BYN"},
  { name: 'Азербайджанский манат - AZN',  value: "₼"},
  { name: 'Казахстанский тенге - KZT',    value: "₸"},
  { name: 'Грузинский лари - GEL',        value: "₾"},
  { name: 'Армянский драм - AMD',         value: "֏"},
  { name: 'Узбекский сум - UZS',          value: "UZS"},
  { name: 'Евро - EUR',                   value: "€"},
  { name: 'Польский злотый - PLN',        value: "zł"},
  { name: 'Монгольский Тугрик - MNT',     value: "MNT"},
  ];

  const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }
      
class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            currentTarif: 1,
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

    handleStep_2 = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            this.setState({
              currentStep: 2,
              chNameLocation: values.chNameLocation,
              chAddressLocation: values.chAddressLocation,
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
          chPhoneLocation: form.getFieldValue('chPhoneLocation')
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


    saveSetup = () => {
      
      var val={};
      const {currentTarif, currentPeriodMonth, chName, chEmailStore, chTimeZone, chCurrency, chNameLocation, chAddressLocation, chPhoneLocation, blPickup, arrOperationMode} = this.state;

      const url = this.props.optionapp[0].serverUrl + "/SaveSetup.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  /*chUID: this.props.owner.chUID,*/
                  chUID: "a3b461d5e2c48b09e7a1",
                  chName: chName,
                  chEmailStore: chEmailStore,
                  chEmailOwner: chEmailStore,
                  iTarif: currentPeriodMonth ? currentTarif : this.state.currentTarif + 4,
                  chTimeZone: chTimeZone,
                  chCurrency: chCurrency,
                  blPickup: blPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  /*chUID: this.props.owner.chUID,*/
                  chUID: "a3b461d5e2c48b09e7a1",
                  chName: chName,
                  chEmailStore: chEmailStore,
                  chEmailOwner: chEmailStore,
                  iTarif: currentPeriodMonth ? currentTarif : this.state.currentTarif + 4,
                  chTimeZone: chTimeZone,
                  chCurrency: chCurrency,
                  blPickup: blPickup ? "1" : "0",
                }
                //this.props.onEdit(val);  // вызываем action
              }).catch((error) => {
                  console.error(error);
              });

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
                  /*chUID: this.props.owner.chUID,*/
                  chUID: "a3b461d5e2c48b09e7a1",
                  blShow: "1",
                  chName: chNameLocation,
                  chAddress: chAddressLocation,
                  arrPhones: chPhoneLocation,
                  arrOperationMode: arrOperationMode,
                  blPickup: blPickup ? "1" : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                console.log(responseJsonFromServer);
                
                /*
                val = {
                  chUID: "a3b461d5e2c48b09e7a1",
                  chName: chName,
                  chEmailStore: chEmailStore,
                  chEmailOwner: chEmailStore,
                  iTarif: currentPeriodMonth ? currentTarif : this.state.currentTarif + 4,
                  chTimeZone: chTimeZone,
                  chCurrency: chCurrency,
                  blPickup: blPickup ? "1" : "0",
                }
                //this.props.onEdit(val);  // вызываем action
                */
              }).catch((error) => {
                  console.error(error);
              });
          
    }


    render() {


      const { currentStep, chName, chTagline, chTimeZone, chCurrency, chEmailStore, chNameLocation, chPhoneLocation, chAddressLocation, currentTarif, currentPeriodMonth, arrOperationMode, blPickup } = this.state;
      const { getFieldDecorator } = this.props.form;

      const IconFont = Icon.createFromIconfontCN({
        scriptUrl: this.props.optionapp[0].scriptIconUrl,
      });

      const options = timezones.map(item => <Option value={item.name} key={item.name}>{item.value}</Option>);
      const phonesLocation = chPhoneLocation.map( (item, index, arr) => {
        return (
          <Row gutter={4} key={item.iPhone}>
            <Col span={23}><Input prefix={<IconFont type="icon-phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" /></Col>
            <Col span={1}>
              { arr.length - 1 === index ? <Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddPhone()}/> :
                <Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelPhone(item)}/> }
            </Col>
          </Row>);
      });

      const optionsMoney = money.map(item => <Option value={item.value} key={item.value}>{item.name} - {item.value}</Option>)
      const OperationMode = arrOperationMode.map( (item, index) => {
        if (!item.blDayOff)
          return item.time.map( (a, indexTime, arr) => {
            if (arr.length - 1 === indexTime) 
              return (
                <Row gutter={4} key={indexTime}>
                  <Col span={5}>{item.chDay}:</Col>
                  <Col span={6}>c <TimePicker addonBefore="Http://" defaultValue={moment(a.tStartTime, format)} format={format} className="time-picker-width"/></Col>
                  <Col span={6}>по <TimePicker defaultValue={moment(a.tEndTime, format)} format={format} className="time-picker-width"/></Col>
                  <Col span={2}><Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddTimePeriod(item.iDay)}/></Col>
                  <Col span={3}><Button type="default" onClick = {() => this.onDayOff(item)}>Выходной</Button></Col>
                </Row>
              ); 
            else
              return (
                <Row gutter={4} key={indexTime}>
                  <Col span={5}>{item.chDay}:</Col>
                  <Col span={6}>c <TimePicker defaultValue={moment(a.tStartTime, format)} format={format} className="time-picker-width"/></Col>
                  <Col span={6}>по <TimePicker defaultValue={moment(a.tEndTime, format)} format={format} className="time-picker-width"/></Col>
                  <Col span={2}><Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelTimePeriod(item, a.iTime)}/></Col>
                  <Col span={3}></Col>
                </Row>
              ); 
          });
        else 
          return (
            <Row gutter={4} key={index}>
              <Col span={5}>{item.chDay}:</Col>
              <Col span={19}><Button type="default" onClick = {() => this.onDayWork(item)}>Рабочий день</Button></Col>
            </Row>
          );
      });



    if (typeof this.props.owner.chUID !== 'undefined') {
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
              <div className="title-setup">
                Базовые настройки
              </div>
              <div className="describe-setup">
                  Вы всегда сможете изменить данную информацию
                </div>
              <Divider dashed />
              <FormItem
                label="Название организации"  
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
              <Col span={18}>
                <div className="title-setup">
                  Добавьте Ваш первый объект
                </div>
                <div className="describe-setup">
                  Вы сможете добавить больше торговых объектов позже
                </div>
              </Col>
              <Col span={6}>
                <div className="title-setup" style={{textAlign: "right"}}>
                  <Button type="default" onClick={() => this.prevStep()}>
                      Назад
                  </Button>
                </div>
              </Col>
            </Row>
            <Divider dashed />
            <FormItem
              label="Название"  
              className="content-form"
              hasFeedback
            >
              {getFieldDecorator('chNameLocation', {
                rules: [{required: true, message: 'Заполните это поле'}],
                initialValue: chNameLocation.length ? chNameLocation : ""
              })(
                <Input prefix={<IconFont type="icon-map-marker" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </FormItem>
            <div className="describe-setup-form">
              Данное название будет доступно только Вам
            </div>
            <Divider dashed />
            <FormItem
              label="Адрес"  
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
            <div className="describe-setup-form">
              Адрес будет доступен клиентам
            </div>
            <Divider dashed />
            <FormItem
              label="Номер телефона (необязательно)"  
              hasFeedback
              className="content-form-not-required"
            >
              {phonesLocation}
              {/*getFieldDecorator('chPhoneLocation', {
                initialValue: chPhoneLocation.length ? chPhoneLocation : ""
              })(
                <Input prefix={<IconFont type="icon-phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
              )*/}
            </FormItem>
            <div className="describe-setup-form">
              Укажите номер телефона торгового объекта, либо единый номер
            </div>
            <Divider dashed />
            <FormItem
              label="Режим работы"  
              hasFeedback
              className="content-form-not-required"
            >
              {OperationMode}
            </FormItem>
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
            <Form onSubmit={this.handleStep_2}>
            <Row>
              <Col span={18}>
                <div className="title-setup">
                  Выберите тарифный план
                </div>
              </Col>
              <Col span={6}>
                <div className="title-setup" style={{textAlign: "right"}}>
                  <Button type="default" onClick={() => this.prevStep()}>
                      Назад
                  </Button>
                </div>
              </Col>
            </Row>
            <Divider dashed />
            <Row>
              <Col>
                <div className="period-payments">
                  <Radio.Group defaultValue={currentPeriodMonth} onChange={this.changePeriod} buttonStyle="solid">
                    <Radio.Button value={true}>Месяц</Radio.Button>
                    <Radio.Button value={false}>Год</Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className="subscription-plans-widget" onClick={() => this.onChangeTarif(1)}>
                  <div className={"subscription-plan " + (currentTarif === 1 && "active")} >
                    <div className={"plan-name " + (currentTarif === 1 && "active")}>
                      Начинающий
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>{currentPeriodMonth ? "19$ - месяц" : "190$ - год"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span>{currentPeriodMonth ? "До 500 заказов" : "До 6 000 заказов"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span>0.10$ за заказ сверх лимита</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 дней бесплатно</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="subscription-plans-widget" onClick={() => this.onChangeTarif(2)}>
                  <div className={"subscription-plan " + (currentTarif === 2 && "active")} >
                    <div className={"plan-name " + (currentTarif === 2 && "active")}>
                      Профессионал
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>{currentPeriodMonth ? "39$ - месяц" : "390$ - год"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span>{currentPeriodMonth ? "До 1 500 заказов" : "До 18 000 заказов"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span>0.07$ за заказ сверх лимита</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 дней бесплатно</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>              
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className="subscription-plans-widget"  onClick={() => this.onChangeTarif(3)}>
                  <div className={"subscription-plan " + (currentTarif === 3 && "active")} >
                    <div className={"plan-name " + (currentTarif === 3 && "active")}>
                      Премиум
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>{currentPeriodMonth ? "89$ - месяц" : "890$ - год"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span>{currentPeriodMonth ? "До 4 000 заказов" : "До 48 000 заказов"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span>0.05$ за заказ сверх лимита</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 дней бесплатно</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="subscription-plans-widget" onClick={() => this.onChangeTarif(4)}>
                  <div className={"subscription-plan " + (currentTarif === 4 && "active")} >
                    <div className={"plan-name " + (currentTarif === 4 && "active")}>
                      Эксперт
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>{currentPeriodMonth ? "169$ - месяц" : "1690$ - год"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span>{currentPeriodMonth ? "До 10 000 заказов" : "До 120 000 заказов"}</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span>0.03$ за заказ сверх лимита</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 дней бесплатно</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>              
              </Col>
            </Row>
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
    }
))(LoginForm)