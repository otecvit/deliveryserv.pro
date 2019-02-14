import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}


class PushForm extends React.Component {

    constructor(props) {
      super(props);
      moment.locale('ru'); // устанавливаем локализацию
      this.state = {
      };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
              const url = this.props.optionapp[0].serverUrl + "/InsertPushNotification.php"; // добавляем категорию
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
                  chTitlePush: values.chTitlePush,
                  chTextPush: values.chTextPush,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                    key: responseJsonFromServer.id.toString(),
                    idPush: responseJsonFromServer.id.toString(),
                    chTitlePush: values.chTitlePush,
                    chTextPush: values.chTextPush,
                    dDateLastSending: moment().format('DD.MM.YYYY hh:mm'),
                }

                this.props.onAdd(val);  // вызываем action
                this.props.form.resetFields(); // ресет полей
                this.props.form.setFieldsValue({
                  'chTitlePush': "",
                  'chTextPush': "",
                });


              }).catch((error) => {
                  console.error(error);
              });

              
              const urlPushSending = this.props.optionapp[0].serverUrlStart + "/SendPushMessage.php"; // добавляем категорию
              fetch(urlPushSending, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  chTitlePush: values.chTitlePush,
                  chTextPush: values.chTextPush,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                message.success("Push-уведомление успешно отправлено");
              }).catch((error) => {
                  console.error(error);
              });
          }
        });
      }


    render() {
      
      const { getFieldDecorator } = this.props.form;
        const labelColSpan = 8;
        return (
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
            <FormItem
              label="Заголовок"
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chTitlePush', {
                rules: [{ required: true, message: 'Введите заголовок Push-уведомления' }],
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Заголовок Push-уведомления" />
              )}
            </FormItem>
            <FormItem
              label="Текст уведомления"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chTextPush', {
                 rules: [{ required: true, message: 'Введите текст Push-уведомления' }],
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Текст Push-уведомления" />
              )}
            </FormItem>
            <FormItem
            >
              <Button type="primary" htmlType="submit">
                <Icon type="plus"/>Отправить
              </Button>
            </FormItem>
          </Form>
        </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(PushForm);

export default connect (
  state => ({
      pushNotification: state.pushNotification,
      owner: state.owner,
      optionapp: state.optionapp,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_PUSH', payload: data});
    },
    onEdit: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },
    
    onDelete: (categoryData) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryData});
    },
  })
)(WrappedNormalLoginForm);
