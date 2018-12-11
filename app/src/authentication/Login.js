import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { Route, Redirect } from 'react-router';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;


class Login extends Component {
    render() {
    
    console.log("fsdfsd");
      
    const { getFieldDecorator } = this.props.form;

    return (
        <Modal
          title="Авторизация"
          centered
          visible={true}
          maskStyle={{backgroundColor: '#f2f2f2'}}
          footer=""
          width='350px'
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
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
            )}
          </FormItem>
          <FormItem
             label="Пароль"  
             className="content-form"
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="" />
            )}
          </FormItem>
          <Divider dashed />
          <FormItem
            className="content-form">
            <Button type="primary" htmlType="submit" className="button-login">
                Войти
            </Button>
          </FormItem>
          <Divider dashed />
          </Form>
          <p className="text-login">Забыли пароль - <Link to="reset-password">Сброс пароля</Link></p>
          <p className="text-login">Нет учетной записи - <Link to="register">Регистрация</Link></p>
          <p className="text-login-copyright">Deliveryserv © 2019 - <Link to="">Условия использования</Link></p>
        </Modal>
        );
    }
}
const LoginForm = Form.create()(Login);

export default LoginForm