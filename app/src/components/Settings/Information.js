import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;
const { TextArea } = Input;


class Information extends Component {

    constructor(props) {
        super(props);
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
                    txtDeliveryTerms: values.txtDeliveryTerms
                })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
                console.log(responseJsonFromServer);
                
                val = {
                    idCustomer: this.props.owner.idCustomer,
                    txtDeliveryTerms: values.txtDeliveryTerms
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
        
        return (<div>
            <HeaderSection title="Информация" icon="icon-orders"/>
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                <FormItem
                    label="Условия доставки"
                    abelCol={{ span: labelColSpan }}
                    style={{ marginBottom: 10 }}
                    >
                    {getFieldDecorator('txtDeliveryTerms', {
                        rules: [],
                        initialValue: this.props.owner.txtDeliveryTerms
                    })(
                        <TextArea prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Укажите условия доставки" autosize={{ minRows: 6 }} />
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

const WrappedNormalForm = Form.create()(Information);

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
