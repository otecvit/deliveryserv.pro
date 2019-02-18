import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class Payment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blCashCourier: this.props.owner.blCashCourier === "true",
            blCardCourier: this.props.owner.blCardCourier === "true",
            blCashPickup: this.props.owner.blCashPickup === "true",
            blCardPickup: this.props.owner.blCardPickup === "true"
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
                  blPickup: this.props.owner.blPickup ? "1" : "0",
                  blDelivery: this.props.owner.blDelivery ? "1" : "0",
                  blCashCourier: this.state.blCashCourier ? "1" : "0",
                  blCardCourier: this.state.blCardCourier ? "1" : "0",
                  blCashPickup: this.state.blCashPickup ? "1" : "0",
                  blCardPickup: this.state.blCardPickup ? "1" : "0",
                  blNewOrderNotification: this.props.owner.blNewOrderNotification ? "1" : "0",
                  chListEmailNotification: this.props.owner.chListEmailNotification
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  blCashCourier: values.blCashCourier.toString(),
                  blCardCourier: values.blCardCourier.toString(),
                  blCashPickup: values.blCashPickup.toString(),
                  blCardPickup: values.blCardPickup.toString(),
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Настройки сохранены');
              }).catch((error) => {
                  console.error(error);
              });

          }
        });
      }

      onChangeCashCourier = (checked) => {
        this.setState({
            blCashCourier: checked,
        })
  
      }

      onChangeCardCourier = (checked) => {
        this.setState({
            blCardCourier: checked,
        })
      }

      onChangeCashPickup = (checked) => {
        this.setState({
            blCashPickup: checked,
        })
  
      }

      onChangeCardPickup = (checked) => {
        this.setState({
            blCardPickup: checked,
        })
      }

    render() {
        const { getFieldDecorator } = this.props.form;
         const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (<div>
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><IconFont type="icon-orders" style={{ fontSize: '16px', marginRight: "10px"}}/>Оплата</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                    <FormItem
                        label="Оплата наличными курьеру"
                        >
                        {getFieldDecorator('blCashCourier', { 
                            initialValue: this.props.owner.blCashCourier === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeCashCourier}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="Оплата банковской карточкой курьеру"
                        >
                        {getFieldDecorator('blCardCourier', { 
                            initialValue: this.props.owner.blCardCourier === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeCardCourier}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="Оплата наличными при самовывозе"
                        > 
                        {getFieldDecorator('blCashPickup', { 
                            initialValue: this.props.owner.blCashPickup === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeCashPickup}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="Оплата банковской карточкой при самовывозе"
                        >
                        {getFieldDecorator('blCardPickup', { 
                            initialValue: this.props.owner.blCardPickup === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeCardPickup}/>
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

const WrappedNormalForm = Form.create()(Payment);

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