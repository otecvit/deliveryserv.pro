import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider, message, Steps, Select, Switch, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;


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


class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 2,
            currentTarif: 1,
            chName: "",
            chTagline: "",
            chEmailStore: "",
            chTimeZone: "Europe/Moscow",
            chCurrency: "₽",
            chNameLocation: "",
            chAddressLocation: "",
            chPhoneLocation: "",
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
              chPhoneLocation: values.chPhoneLocation
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
        chNameLocation: form.getFieldValue('chNameLocation'),
        chAddressLocation: form.getFieldValue('chAddressLocation'),
        chPhoneLocation: form.getFieldValue('chPhoneLocation')
      })
    }

    changeTarif = (e) => {
      this.setState({
        currentTarif: e,
      })      
    }


    render() {


      const { currentStep, chName, chTagline, chTimeZone, chCurrency, chEmailStore, chNameLocation, chPhoneLocation, chAddressLocation, currentTarif } = this.state;
      const { getFieldDecorator } = this.props.form;

      const options = timezones.map(item => <Option value={item.name} key={item.name}>{item.value}</Option>);
      const optionsMoney = money.map(item => <Option value={item.value} key={item.value}>{item.name} - {item.value}</Option>)

      const IconFont = Icon.createFromIconfontCN({
        scriptUrl: this.props.optionapp[0].scriptIconUrl,
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
                label="Слоган (необязательно)"  
                hasFeedback
                className="content-form-not-required"
              >
                {getFieldDecorator('chTagline', {
                  initialValue: chTagline.length ? chTagline : ""
                })(
                  <Input prefix={<IconFont type="icon-eyes" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                )}
              </FormItem>
              <Divider dashed />
              <FormItem
                label="E-mail магазина (необязательно)"  
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
                      onChange={this.onChangeClient}
                      >
                      {options}
                  </Select>
                )}
              </FormItem>
              <Divider dashed />
                    <FormItem 
                        label="Валюта магазина"
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
                                onChange={this.onChangeClient}
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
                  Добавьте Ваш первый магазин
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
            <Divider dashed />
            <FormItem
              label="Номер телефона (необязательно)"  
              hasFeedback
              className="content-form-not-required"
            >
              {getFieldDecorator('chPhoneLocation', {
                initialValue: chPhoneLocation.length ? chPhoneLocation : ""
              })(
                <Input prefix={<IconFont type="icon-phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
              )}
            </FormItem>
            <Divider dashed />
            <FormItem
              label="Режим работы"  
              hasFeedback
              className="content-form-not-required"
            >
              {getFieldDecorator('chPhoneLocation', {
                initialValue: chPhoneLocation.length ? chPhoneLocation : ""
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
              )}
            </FormItem>
            <Divider dashed />
            <FormItem
              label="Возможен самовывоз"
              className="content-form-not-required"
            >
              {getFieldDecorator('enPickup', { 
                initialValue: true,
                valuePropName: 'checked'
              })(
                <Switch/>
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
            <Row gutter={24}>
              <Col span={12}>
                <div className="subscription-plans-widget" onClick={() => this.changeTarif(1)}>
                  <div className={"subscription-plan " + (currentTarif === 1 && "active")} >
                    <div className={"plan-name " + (currentTarif === 1 && "active")}>
                      Basic
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>$290 USD - annual</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span><span>Up to 6,000 orders</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span><span>$0.12 per extra order</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 day trial</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="subscription-plans-widget" onClick={() => this.changeTarif(2)}>
                  <div className={"subscription-plan " + (currentTarif === 2 && "active")} >
                    <div className={"plan-name " + (currentTarif === 2 && "active")}>
                      Basic
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>$290 USD - annual</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span><span>Up to 6,000 orders</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span><span>$0.12 per extra order</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 day trial</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>              
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div className="subscription-plans-widget"  onClick={() => this.changeTarif(3)}>
                  <div className={"subscription-plan " + (currentTarif === 3 && "active")} >
                    <div className={"plan-name " + (currentTarif === 3 && "active")}>
                      Basic
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>$290 USD - annual</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span><span>Up to 6,000 orders</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span><span>$0.12 per extra order</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 day trial</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="subscription-plans-widget" onClick={() => this.changeTarif(4)}>
                  <div className={"subscription-plan " + (currentTarif === 4 && "active")} >
                    <div className={"plan-name " + (currentTarif === 4 && "active")}>
                      Basic
                    </div>
                    <div className="plan-details">
                      <div className="plan-detail">
                        <p><IconFont type="icon-money"/></p>
                        <p><span>$290 USD - annual</span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-orders"/></p>
                        <p><span><span>Up to 6,000 orders</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-order"/></p>
                        <p><span><span>$0.12 per extra order</span></span></p>
                      </div>
                      <div className="plan-detail">
                        <p><IconFont type="icon-timer-sand"/></p>
                        <p><span><span>30 day trial</span></span></p>
                      </div>
                    </div>
                  </div>
                </div>              
              </Col>
            </Row>
            <Divider dashed />
            <FormItem>
              <Button type="primary" htmlType="submit" className="button-login">
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