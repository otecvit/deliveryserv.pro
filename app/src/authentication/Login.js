import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider } from 'antd'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;


class Login extends Component {



    render() {

    const { getFieldDecorator } = this.props.form;

    return (
        <Modal
          title="Авторизация"
          centered
          visible={true}
          maskStyle={{backgroundColor: '#f2f2f2'}}
          footer=""
          width='300px'
          className="form-login"
        >
          <Form onSubmit={this.handleSubmit}>
          <FormItem
            className="content-center"
            formLayout='vertical'
          >
            {getFieldDecorator('radio-group', {
              initialValue: "a"
            })(
              <RadioGroup
                buttonStyle="solid"
              >
                <RadioButton  value="a">Владелец</RadioButton >
                <RadioButton  value="b">Сотрудник</RadioButton >
              </RadioGroup>
            )}
          </FormItem>
          <Divider dashed />
          <FormItem
            label="E-mail"  
            className="content-form"
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem
             label="Пароль"  
             className="content-form"
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          </Form>
        </Modal>
        );
    }
}
const LoginForm = Form.create()(Login);

export default LoginForm