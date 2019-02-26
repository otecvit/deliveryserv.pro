import React, { Component } from 'react'
import { Form, Icon, Input, Button, Tooltip, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';


const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

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


class General extends Component {

    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
                const url = this.props.optionapp[0].serverUrl + "/EditOwner.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  chName: values.chName,
                  chTagline: "",
                  chEmailStore: values.chEmailStore,
                  chTimeZone: values.chTimeZone,
                  chCurrency: values.chCurrency,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  chUID: this.props.owner.chUID,
                  chName: values.chName,
                  chTagline: "",
                  chEmailStore: values.chEmailStore,
                  chTimeZone: values.chTimeZone,
                  chCurrency: values.chCurrency,
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Настройки сохранены');
              }).catch((error) => {
                  console.error(error);
              });

          }
        });
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelColSpan = 8;

        //console.log(timezones);
        
        const options = timezones.map(item => <Option value={item.name} key={item.name}>{item.value}</Option>);
        const optionsMoney = money.map(item => <Option value={item.value} key={item.value}>{item.name} - {item.value}</Option>)

        return (<div>
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><Icon type="setting" style={{ fontSize: '16px', marginRight: "10px"}}/>Общие</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                <FormItem
                    label={
                        <span>
                            Название организации&nbsp;
                            <Tooltip title="Данное название будет учавствовать в работе всей системы.">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                    abelCol={{ span: labelColSpan }}
                    style={{ marginBottom: 10 }}
                    
                    hasFeedback
                    >
                    {getFieldDecorator('chName', {
                        rules: [{ required: true, message: 'Введите название организации' }],
                        initialValue: this.props.owner.chName
                    })(
                        <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Название магазина" maxLength = "100"/>
                    )}
                    </FormItem>
                   
                    <FormItem
                        label="E-mail магазина"
                        abelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('chEmailStore', {
                            rules: [{
                                type: 'email', message: 'Введите корректный E-mail',
                              }],
                            initialValue: this.props.owner.chEmailStore
                        })(
                            <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail магазина" maxLength = "100"/>
                        )}
                    </FormItem>
                    <FormItem 
                        label="Часовой пояс"
                        labelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('chTimeZone', {
                            rules: [{ required: true, message: 'Выберите часовой пояс' }],
                            initialValue: this.props.owner.chTimeZone,
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
                        labelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('chCurrency', {
                            rules: [{ required: true, message: 'Выберите валюту' }],
                            initialValue: this.props.owner.chCurrency,
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
                        <Icon type="plus"/>Сохранить
                    </Button>
                    </FormItem>
                </Form>                                    
                </div>
            </Content>          
        </div>)
    }
}

const WrappedNormalForm = Form.create()(General);

export default connect (
  state => ({
      stock: state.stock,
      optionapp: state.optionapp,
      owner: state.owner,
  }),
  dispatch => ({
    onEdit: (data) => {
      dispatch({ type: 'EDIT_OWNER', payload: data});
    },
  })
)(WrappedNormalForm);
