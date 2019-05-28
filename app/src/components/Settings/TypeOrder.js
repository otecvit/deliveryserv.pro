import React, { Component, Fragment } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Tooltip, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class TypeOrder extends Component {

    state = {
            blPickup: this.props.owner.blPickup === "true",
            blDelivery: this.props.owner.blDelivery === "true"
        }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
                const url = `${this.props.optionapp[0].serverUrl}/EditOwnerSettings.php`; // 
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  blPickup: this.state.blPickup ? "1" : "0",
                  blDelivery: this.state.blDelivery ? "1" : "0",
                  iPriceOfDelivery: typeof values.iPriceOfDelivery !== "undefined" ? values.iPriceOfDelivery : "0",
		            	iOrderFreeDelivery: typeof values.iOrderFreeDelivery !== "undefined" ? values.iOrderFreeDelivery : "0", 
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  blPickup: values.blPickup.toString(),
                  blDelivery: values.blDelivery.toString(),
                  iPriceOfDelivery: typeof values.iPriceOfDelivery !== "undefined" ? values.iPriceOfDelivery : "0",
		            	iOrderFreeDelivery: typeof values.iOrderFreeDelivery !== "undefined" ? values.iOrderFreeDelivery : "0", 
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
        const { blDelivery } = this.state;
        
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (<div>
            <HeaderSection title="Типы заказов" icon="icon-orders"/>
            <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px", padding: 10 }}>
                    <FormItem
                        label={
                          <span>
                              Самовывоз&nbsp;
                              <Tooltip title="Предоставляется возможность самовывоза заказа с выбранного адреса. В приложении будет активирован соответствующий режим">
                                  <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                              </Tooltip>
                          </span>
                        }
                        >
                        {getFieldDecorator('blPickup', { 
                            initialValue: this.props.owner.blPickup === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangePickup}/>
                        )}
                    </FormItem>
                    <FormItem
                        label={
                          <span>
                              Доставка&nbsp;
                              <Tooltip title="Предоставляется возможность доставки заказов клиенту. В приложении будет активирован соответствующий режим">
                                  <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                              </Tooltip>
                          </span>
                        }
                        >
                        {getFieldDecorator('blDelivery', { 
                            initialValue: this.props.owner.blDelivery === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeDelivery}/>
                        )}
                    </FormItem>
                    { blDelivery &&
                    <Fragment>
                      <FormItem
                          label={
                            <span>
                                Стоимость доставки&nbsp;
                                <Tooltip title="Стоимость доставки заказа. Если доставка всегда бесплатная, то укажите 0">
                                    <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                                </Tooltip>
                            </span>
                          }
                          style={{ marginBottom: 10 }}
                          hasFeedback
                          >
                          {getFieldDecorator('iPriceOfDelivery', {
                              getValueFromEvent: (e) => {
                                const convertedValue = Number(e.currentTarget.value);
                                if (isNaN(convertedValue)) {
                                  return Number(this.props.form.getFieldValue("iPriceOfDelivery"));
                                } else {
                                  return convertedValue;
                                }
                              },
                              initialValue: this.props.owner.iPriceOfDelivery
                          })(
                              <Input prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />} maxLength = "10" />
                          )}
                      </FormItem>
                      <FormItem
                          label={
                            <span>
                                Сумма заказа для бесплатной доставки&nbsp;
                                <Tooltip title="Сумма заказа после которой доставка осуществляется бесплатно. Если доставка только платная, то укажите максимальную сумму заказака">
                                    <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                                </Tooltip>
                            </span>
                        }
                          style={{ marginBottom: 10 }}
                          hasFeedback
                          >
                          {getFieldDecorator('iOrderFreeDelivery', {
                              getValueFromEvent: (e) => {
                                const convertedValue = Number(e.currentTarget.value);
                                if (isNaN(convertedValue)) {
                                  return Number(this.props.form.getFieldValue("iOrderFreeDelivery"));
                                } else {
                                  return convertedValue;
                                }
                              },
                              initialValue: this.props.owner.iOrderFreeDelivery
                          })(
                              <Input prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} maxLength = "10"/>}/>
                          )}
                      </FormItem>
                    </Fragment>}
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