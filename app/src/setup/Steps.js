import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider, message, Steps, Select } from 'antd'
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
            currentStep: 0,
         };
    }

    

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const urlOwner = this.props.optionapp[0].serverUrl + "/InsertOwner.php";
            fetch(urlOwner, {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                  chEmailOwner: values.chEmailOwner,
                  chHashPassword: values.password,
              })

            }).then((response) => response.json()).then((responseServer) => {
              console.log(responseServer);

            if (responseServer.status === "1") {
              const val = {
                chUID: responseServer.chUID,
              }
              this.props.onAdd(val);  // вызываем action
            }
            else {
              message.error('Пользователь с данным e-mail уже зарегистрирован');
            }
            

            
        }).catch((error) => {
              console.error(error);
        }); 
            /*
            var val = {};
              const url = this.props.optionapp[0].serverUrl + "/EditProducts.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  idDishes: this.props.param,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: this.props.param,
                  }
                }
                this.props.onEdit(val);  // вызываем action
                message.success('Товар изменен');
                this.props.form.resetFields(); // ресет полей

              }).catch((error) => {
                  console.error(error);
              });
   */
          }
        });
      }

      next = () => {
        const currentStep = this.state.currentStep + 1;
        this.setState({
          currentStep: currentStep
        })
      }


    render() {

      const { currentStep } = this.state;
      const { getFieldDecorator } = this.props.form;

      const options = timezones.map(item => <Option value={item.name} key={item.name}>{item.value}</Option>);
      const optionsMoney = money.map(item => <Option value={item.value} key={item.value}>{item.name} - {item.value}</Option>)

    if (typeof this.props.owner.chUID !== 'undefined') {
      return <Redirect to="/"/>
    }

    return (
        <Modal
          title="Регистрация"
          centered
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
          <Step key="4"/>
          </Steps>
          { currentStep === 0 && 

            <Form onSubmit={this.handleSubmitStep_1}>
            <FormItem
              label="Название"  
              className="content-form"
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{
                      required: true, message: 'Заполните это поле',
                  }
                ],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </FormItem>
            <FormItem
              label="Слоган (необязательно)"  
              hasFeedback
            >
              {getFieldDecorator('chTagline')(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </FormItem>
            <FormItem
            label="E-mail магазина (необязательно)"  
            hasFeedback
          >
            {getFieldDecorator('chEmailStore', {
              rules: [{
                type: 'email', message: 'Некорректный формат E-mail',
                } 
              ],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
            )}
           </FormItem>
           <FormItem 
                        label="Часовой пояс"
                        hasFeedback
                        >
                        {getFieldDecorator('chTimeZone', {
                            rules: [{ required: true, message: 'Выберите часовой пояс' }],
                            initialValue: 	"Europe/Moscow",
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
                    <FormItem 
                        label="Валюта магазина"
                        hasFeedback
                        >
                        {getFieldDecorator('chCurrency', {
                            rules: [{ required: true, message: 'Выберите валюту' }],
                            initialValue: "₽",
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
                    <FormItem>
                    <Button type="primary" htmlType="submit">
                        <Icon type="plus"/>Далее
                    </Button>
                    </FormItem>
            </Form>
          
          }
          { currentStep === 1 && "2" }
          { currentStep === 2 && "3" }
          { currentStep === 3 && "4" }
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