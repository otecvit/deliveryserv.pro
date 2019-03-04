import React, { Component } from 'react'
import { Modal, Button, Radio, Form, Icon, Input, Divider, message } from 'antd'
import { Link } from 'react-router-dom'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'

import { arrPageAccess } from '../constans'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

class Registration extends Component {


    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            username: Cookies.get('username'),
            confirmDirty: false,
         };
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Пароли не совпадают');
        } else {
          callback();
        }
      }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
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
                  arrAccess: arrPageAccess,
              })

            }).then((response) => response.json()).then((responseServer) => {
              if (responseServer.status === "1") {
                const val = {
                  chUID: responseServer.chUID,
                  chUIDStaff: responseServer.chUIDStaff,
                  arrAccess: arrPageAccess,
                  iStaffType: "0",

                }
                this.props.onAdd(val);  // вызываем action
                /// делаем куку
                const { cookies } = this.props;
                Cookies.set('cookiename', responseServer.chUIDStaff, { expires: 365 , path: '/' });
              }
              else {
                message.error('Пользователь с данным e-mail уже зарегистрирован');
              }
            

            
        }).catch((error) => {
              console.error(error);
        }); 
       }
      });
    }


    render() {

    const { getFieldDecorator } = this.props.form;

    if (typeof this.props.owner.chUID !== 'undefined') {
      return <Redirect to="/setup"/>
    }

    return (
        <Modal
          title="Регистрация"
          centered
          visible={true}
          maskStyle={{backgroundColor: '#f2f2f2'}}
          footer=""
          width='350px'
          className="form-login"
        >
          <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="E-mail"  
            className="content-form"
          >
            {getFieldDecorator('chEmailOwner', {
              rules: [{
                type: 'email', message: 'Некорректный формат E-mail',
                }, {
                    required: true, message: 'Заполните это поле',
                }
              ],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
            )}
          </FormItem>
          <FormItem
             label="Пароль"  
             className="content-form"
          >
            {getFieldDecorator('password', {
              rules: [{
                    required: true, message: 'Заполните это поле',
                }, {
                    validator: this.validateToNextPassword,
                }
              ],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="" />
            )}
          </FormItem>
          <FormItem
             label="Повторите пароль"  
             className="content-form"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Повторите пароль',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder=""  onBlur={this.handleConfirmBlur}/>
            )}
          </FormItem>
          <Divider dashed />
          <FormItem
            className="content-form">
            <Button type="primary" htmlType="submit" className="button-login">
                Зарегистрироваться
            </Button>
          </FormItem>
          <Divider dashed />
          </Form>
          <p className="text-login">Уже есть аккаунт - <Link to="login">Войти</Link></p>
          <p className="text-login">Забыли пароль - <Link to="reset-password">Сброс пароля</Link></p>
          <p className="text-login-copyright">Deliveryserv © 2019 - <Link to="">Условия использования</Link></p>
        </Modal>
        );
    }
}
const LoginForm = Form.create()(Registration);

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