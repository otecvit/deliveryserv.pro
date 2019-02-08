import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Modal, Button, Radio, Form, Icon, Input, Divider, Spin, message } from 'antd'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import LoadingScreen from '../components/LoadingScreen';

const FormItem = Form.Item;


class ResetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
         checkCookies: false,
      };
}

  componentDidMount()  {
    // получаем cookies
    const currentUser = Cookies.get('cookiename');
    if (typeof currentUser !== 'undefined') {
        
        const url = this.props.optionapp[0].serverUrl + "/SelectOwner.php"; // изменяем категорию
        fetch(url, {
          method: 'POST',
          headers: 
          {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
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

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
         
            const url = this.props.optionapp[0].serverUrl + "/ResetPassword.php"; // изменяем категорию
            fetch(url, {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                chEmailOwner: values.chEmailOwner
              })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
                //console.log(responseJsonFromServer);
                message.success('Ссылка для сброса пароля отправлена на указанный e-mail');
                /*
                if (responseJsonFromServer.owner.length) {
                    this.props.onCheckUser(responseJsonFromServer.owner[0]);  // вызываем action
                    console.log(responseJsonFromServer.owner[0].chUID);
                    Cookies.set('cookiename', responseJsonFromServer.owner[0].chUID, { expires: 365 , path: '/' });
                }
                */
            }).catch((error) => {
                console.error(error);
            });
 
    }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { checkCookies } = this.state;
    if (!checkCookies) return <LoadingScreen />;

    if (typeof this.props.owner.chUID !== 'undefined') {
      return <Redirect to="/"/>
    }  

    return (
        <Modal
          title="Сброс пароля"
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
              rules: [{ required: true, message: 'Введите e-mail' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
            )}
          </FormItem>
          <FormItem
            className="content-form">
            <Button type="primary" htmlType="submit" className="button-login">
                Отправить письмо
            </Button>
          </FormItem>
          <Divider dashed />
          </Form>
          <p className="text-login">Уже есть аккаунт - <Link to="login">Войти</Link></p>
          <p className="text-login">Нет учетной записи - <Link to="register">Регистрация</Link></p>
          <p className="text-login-copyright">Deliveryserv © 2019 - <Link to="">Условия использования</Link></p>
        </Modal>
        );
    }
}
const ResetPasswordForm = Form.create()(ResetPassword);

export default connect (
  state => ({
    orders: state.orders,
    optionapp: state.optionapp,
    owner: state.owner,
  }),
  dispatch => ({
    onEditStatus: (data) => {
        dispatch({ type: 'EDIT_ORDERS_STATUS', payload: data});
      },
    onCheckUser: (data) => {
         dispatch({ type: 'LOAD_OWNER_ALL', payload: data})
    },    
  })
)(ResetPasswordForm);