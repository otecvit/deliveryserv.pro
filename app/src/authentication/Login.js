import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Modal, Button, Radio, Form, Icon, Input, Divider, Spin, message } from 'antd'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import LoadingScreen from '../components/LoadingScreen';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
        checkCookies: false,
        iStaffType: 0,
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
            chUIDStaff: currentUser,
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
         
            console.log( {
              iStaffType: this.state.iStaffType,
              chEmailOwner: values.chEmailOwner,
              chHashPassword: values.password,
            });
            
            const url = this.props.optionapp[0].serverUrl + "/CheckOwner.php"; // изменяем категорию
            fetch(url, {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                iStaffType: this.state.iStaffType,
                chEmailOwner: values.chEmailOwner,
                chHashPassword: values.password,
              })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
               
                if (responseJsonFromServer.owner[0].status === "1") {
                    this.props.onCheckUser(responseJsonFromServer.owner[0]);  // вызываем action
                    Cookies.set('cookiename', responseJsonFromServer.owner[0].chUIDStaff, { expires: 365 , path: '/' });
                } else {
                  message.error("Проверьте имя пользователя или пароль");
                }


            }).catch((error) => {
                console.error(error);
            });
 
    }
    });
  }

  onStaffType = (e) => {
    this.setState({
      iStaffType: e.target.value === "0" ? 0 : 1
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { checkCookies, iStaffType } = this.state;

    // загружаем данные с сервера
    if (!checkCookies) return <LoadingScreen />;

    if (typeof this.props.owner.chUID !== 'undefined') {
      return <Redirect to="/"/>
    }  

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
              initialValue: "0"
            })(
              <RadioGroup
                buttonStyle="solid"
                onChange={this.onStaffType} 
              >
                <RadioButton  value="0">Владелец</RadioButton >
                <RadioButton  value="1">Сотрудник</RadioButton >
              </RadioGroup>
            )}
          </FormItem>
          <Divider dashed />
          <FormItem
            label={!iStaffType ? "E-mail" : "Логин"}  
            className="content-form"
          >
            {getFieldDecorator('chEmailOwner', {
              rules: [{ required: true, message: 'Введите e-mail' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="" />
            )}
          </FormItem>
          <FormItem
             label="Пароль"  
             className="content-form"
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Введите пароль' }],
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
)(LoginForm);