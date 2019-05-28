import React, { Component } from 'react'
import { Modal, Button, Form, Icon, Input, Divider, message, Spin } from 'antd'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'

const FormItem = Form.Item;

class ChangePassword extends Component {
    state = {
        checkCookies: false
    };

  componentDidMount()  {
      // получаем cookies
      const currentUser = Cookies.get('cookiename');
      if (typeof currentUser !== 'undefined') {
          const url = `${this.props.optionapp[0].serverUrl}/SelectOwner.php`; // проверяем пользователя
          fetch(url, {
            method: 'POST',
            body: JSON.stringify(
            {
              chUID: currentUser,
            })
          }).then((response) => response.json()).then((responseJsonFromServer) => {
              if (responseJsonFromServer.owner.length) {
                  this.props.onCheckUser(responseJsonFromServer.owner[0]);  // вызываем action
              }
              this.setState ({
                  checkCookies: true,
              })
          }).catch((error) => {
              console.error(error);
          });
      } else {
        this.setState ({
            checkCookies: true,
        })
      }
    }  

    // 
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

    // сохраняем новый пароль
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const urlOwner = `${this.props.optionapp[0].serverUrl}/ChangePassword.php`;
            const query = new URLSearchParams(this.props.location.search);
            const resetToken = query.get('resetToken')
            const userId = query.get('userId')
            fetch(urlOwner, {
              method: 'POST',
              body: JSON.stringify(
              {
                    resetToken: resetToken,
                    userId: userId,
                    chHashPassword: values.password,
              })
             }).then((response) => response.json()).then((responseServer) => {
              
              if (responseServer.status === "1") {
                message.success('Пароль изменен успешно');
              }
              else {
                message.error('Ссылка для восстановления пароля устарела');
              }
        }).catch((error) => {
              console.error(error);
        }); 
       }
      });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const { checkCookies } = this.state;
        if (!checkCookies) return <Spin />; // спиннер загрузки
        if (typeof this.props.owner.chUID !== 'undefined') { // пользователь идентифицирован перенаправляем на домашнюю страницу
          return <Redirect to="/"/>
        } 

        return (
            <Modal
              title="Изменить пароль"
              centered
              visible={true}
              maskStyle={{backgroundColor: '#f2f2f2'}}
              footer=""
              width='350px'
              className="form-login"
            >
              <Form onSubmit={this.handleSubmit}>
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
                    Изменить пароль
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

const ChangePasswordForm = Form.create()(ChangePassword);

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
))(ChangePasswordForm)