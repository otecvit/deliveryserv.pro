import React, { Component } from 'react'
import { Form, Icon, Input, Button, Tooltip, message, Layout, Select } from 'antd'
import { connect } from 'react-redux'

import HeaderSection from '../../items/HeaderSection'
import { timezones, money } from '../../constans'

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class General extends Component {

    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
                const url = `${this.props.optionapp[0].serverUrl}/EditOwner.php`; // изменяем категорию
              fetch(url, {
                method: 'POST',
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

        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });
        
        const options = timezones.map(item => <Option value={item.name} key={item.name}>{item.value}</Option>);
        const optionsMoney = money.map(item => <Option value={item.value} key={item.value}>{item.name} - {item.value}</Option>)

        return (<div>
            <HeaderSection title="Общие" icon="icon-setting"/>
            <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px", padding: 10}}>
                <FormItem
                    label={
                        <span>
                            Название организации&nbsp;
                            <Tooltip title="Данное название будет учавствовать в работе всей системы.">
                                <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
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
                        label={
                            <span>
                                E-mail магазинаи&nbsp;
                                <Tooltip title='При необходимости укажите e-mail магазина. Настройка уведомлений осуществляется в разделе "Настройки" - "E-mail уведомдения"'>
                                    <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                                </Tooltip>
                            </span>
                        }
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
                            <Input prefix={<IconFont type="icon-emailicon" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail магазина" maxLength = "100"/>
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
