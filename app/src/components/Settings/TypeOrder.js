import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class TypeOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blPickup: this.props.owner.blPickup === "true",
            blDelivery: this.props.owner.blDelivery === "true"
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
                  blPickup: this.state.blPickup ? "1" : "0",
                  blDelivery: this.state.blDelivery ? "1" : "0",
                  
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  blPickup: values.blPickup.toString(),
                  blDelivery: values.blDelivery.toString(),
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Настройки сохранены');
              }).catch((error) => {
                  console.error(error);
              });

          }
        });
      }

      onChangePickup = (checked) => {
        this.setState({
            blPickup: checked,
        })
  
      }

      onChangeDelivery = (checked) => {
        this.setState({
            blDelivery: checked,
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
                <div className="title-section"><IconFont type="icon-orders" style={{ fontSize: '16px', marginRight: "10px"}}/>Типы заказов</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                    <FormItem
                        label="Самовывоз"
                        >
                        {getFieldDecorator('blPickup', { 
                            initialValue: this.props.owner.blPickup === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangePickup}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="Доставка"
                        >
                        {getFieldDecorator('blDelivery', { 
                            initialValue: this.props.owner.blDelivery === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeDelivery}/>
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

const WrappedNormalForm = Form.create()(TypeOrder);

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