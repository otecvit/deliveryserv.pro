import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider, message, Steps, Select, Switch, Row, Col, TimePicker } from 'antd'
import { Link } from 'react-router-dom'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import Cookies from 'js-cookie'

import TariffPlans, { Tariffs } from '../items/TariffPlans'

const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;
const format = 'HH:mm';


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
          arrOperationMode: this.state.arrOperationMode.map( (item, index) => {
            const newdata = {
                ...item,
                time: item.time.map( (a, indexTime, arr) => {
                var newArr = {};
                newArr.iTime= index.toString();
                newArr.tStartTime = form.getFieldValue("tStartTime" + index + indexTime).format('HH:mm');
                newArr.tEndTime = form.getFieldValue("tEndTime" + index + indexTime).format('HH:mm');
                return newArr;
              })
            };
            return newdata;
          })
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

    // выход из регистрации
    onExit = () => {

      const url = this.props.optionapp[0].serverUrl + "/DeleteOwner.php"; // удаление
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
              idCustomer: this.props.owner.idCustomer
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
          console.log(responseJsonFromServer);
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
      
      console.log(chPhoneLocation);
      
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
      
      const OperationMode = arrOperationMode.map( (item, index) => {
        if (!item.blDayOff)
          return item.time.map( (a, indexTime, arr) => {
            if (arr.length - 1 === indexTime) 
              return (
                <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                  <Col span={4} style={{ marginTop: 9, paddingLeft: '0px'  }}>{item.chDay}:</Col>
                  <Col span={6}> 
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
                  <Col span={6}>
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
                  <Col span={2} style={{ marginTop: 8  }}><Button type="default" shape="circle" icon="plus" size="small" onClick={() => this.AddTimePeriod(item.iDay)}/></Col>
                  <Col span={6} style={{ marginTop: 4  }}><Button type="default" onClick = {() => this.onDayOff(item)}>Выходной</Button></Col>
                </Row>
              ); 
            else
              return (
                <Row gutter={4} key={indexTime} style={{ marginBottom: 0  }} >
                  <Col span={4} style={{ marginTop: 9, paddingLeft: '0px'  }}>{item.chDay}:</Col>
                  <Col span={6}> 
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
                  <Col span={6}>
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
                  <Col span={2} style={{ marginTop: 8  }}><Button type="default" shape="circle" icon="minus" size="small" onClick={() => this.DelTimePeriod(item, a.iTime)}/></Col>
                  <Col span={6}></Col>
                </Row>
              ); 
          });
        else 
          return (
            <Row gutter={4} key={index} style={{ marginBottom: 3  }} >
              <Col span={4} style={{ marginTop: 9, paddingLeft: 0  }}>{item.chDay}:</Col>
              <Col span={20} style={{ marginTop: 4  }}><Button type="default" onClick = {() => this.onDayWork(item)}>Рабочий день</Button></Col>
            </Row>
          );
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
              <div className="ant-form-item-label" style = {{ lineHeight: '19px' }}><label>Номер телефона (необязательно)</label></div>
              {phonesLocation}
            <div className="describe-setup-form">
              Укажите номер телефона торгового объекта, либо единый номер
            </div>
            <Divider dashed />
            <div className="ant-form-item-label"><label>Режим работы</label></div>
              {OperationMode}
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
            <TariffPlans onSelectTariff={this.handleTariff} currentTariff = {currentTarif}/>
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