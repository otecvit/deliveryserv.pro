import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Modal, Button, Radio, Form, Icon, Input, Divider, Spin, message } from 'antd'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import LoadingScreen from '../components/LoadingScreen';

const FormItem = Form.Item;


class ActivationOwner extends Component {

  constructor(props) {
    super(props);
    this.state = {
        blLoadingData: false,
        blCheckCode: false,
        blContinueJob: false,
      };
}

  componentDidMount()  {
    
        const urlCheckCode = this.props.optionapp[0].serverUrl + "/CheckActivation.php";

        const query = new URLSearchParams(this.props.location.search);
        const chActivationCode = query.get('code')

        fetch(urlCheckCode, {
        method: 'POST',
        headers: 
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
            chActivationCode: chActivationCode,
        })

        }).then((response) => response.json()).then((responseServer) => {

            console.log(responseServer);
            
            this.setState({
                blLoadingData: true,
            });
            if (responseServer.status === "1") {
                this.setState({
                    blCheckCode: true,
                });
            }

        }).catch((error) => {
            console.error(error);
        }); 

    }  

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            this.setState({
                blContinueJob: true,
            })
        }
    });
  }

  render() {
    const { blLoadingData, blContinueJob, blCheckCode } = this.state;

    if (!blLoadingData) return <LoadingScreen />;

    if (blContinueJob) {
      return <Redirect to="/"/>
    } 
    

    return (
        <Modal
          title="Активация аккаунта"
          centered
          visible={true}
          maskStyle={{backgroundColor: '#f2f2f2'}}
          footer=""
          width='350px'
          className="form-login"
        >
          { blCheckCode ?
          <Form onSubmit={this.handleSubmit}>
            <label>Спасибо, Ваш аккаунт активирован.</label>
            <Divider dashed />
          <FormItem
            className="content-form">
            <Button type="primary" htmlType="submit" className="button-login">
                Продолжить работу
            </Button>
          </FormItem>
          
          </Form> 
          : <label>Ссылка для активации устарела. Войдите в личный кабинет и запросите активацию повторно.</label>
          }
          <Divider dashed />
          <p className="text-login">Уже есть аккаунт - <Link to="login">Войти</Link></p>
          <p className="text-login">Нет учетной записи - <Link to="register">Регистрация</Link></p>
          <p className="text-login-copyright">Deliveryserv © 2019 - <Link to="">Условия использования</Link></p>
        </Modal>
        );
    }
}
const ResetPasswordForm = Form.create()(ActivationOwner);

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