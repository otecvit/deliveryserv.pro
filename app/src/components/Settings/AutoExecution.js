import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class AutoExecution extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blAutoComplete: this.props.owner.blAutoComplete === "true"
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
              const url = this.props.optionapp[0].serverUrl + "/EditOwnerSettings.php"; // изменяем категорию
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
                  blAutoComplete: this.state.blAutoComplete ? "1" : "0",
                  tSetStatusComplete: typeof values.tSetStatusComplete !== "undefined" ? values.tSetStatusComplete : "0",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  blAutoComplete: values.blAutoComplete.toString(),
                  tSetStatusComplete: typeof values.tSetStatusComplete !== "undefined" ? values.tSetStatusComplete : "0",
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Настройки сохранены');
              }).catch((error) => {
                  console.error(error);
              });


          }
        });
      }

     onChange = (checked) => {
        this.setState({
            blAutoComplete: checked,
        })
  
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { blAutoComplete } = this.state;
        const labelColSpan = 8;

        return (<div>
            <HeaderSection title="Автовыполнение заказа" icon="icon-orders"/>
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                <FormItem
                    label="Разрешить автоматическое изменение статуса заказа"
                    >
                    {getFieldDecorator('blAutoComplete', { 
                        initialValue: this.props.owner.blAutoComplete === "true",
                        valuePropName: 'checked'
                    })(
                        <Switch onChange={this.onChange}/>
                    )}
                </FormItem>
                { blAutoComplete ?
                <div>
                    <FormItem
                        label='Время до установки статуса "Выполнен" (минут)'
                        abelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('tSetStatusComplete', {
                            rules: [],
                            initialValue: this.props.owner.tSetStatusComplete
                        })(
                            <Input prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="7" />
                        )}
                    </FormItem>
                        </div>
                    : null }
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

const WrappedNormalForm = Form.create()(AutoExecution);

export default connect (
  state => ({
      optionapp: state.optionapp,
      owner: state.owner,
  }),
  dispatch => ({
    onEdit: (data) => {
      dispatch({ type: 'EDIT_OWNER', payload: data});
    },
  })
)(WrappedNormalForm);