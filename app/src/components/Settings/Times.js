import React, { Component } from 'react'
import { Form, Icon, Input, Button, message, Switch, Layout, Tooltip } from 'antd'
import { connect } from 'react-redux'

import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;

class Times extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blLater: this.props.owner.blLater === "true"
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
                const url = this.props.optionapp[0].serverUrl + "/EditOwnerTimes.php"; // изменяем категорию
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
                  blLater: this.state.blLater ? "1" : "0",
                  iDaysAhead: values.iDaysAhead,
                  iFirstOrder: values.iFirstOrder,
                  iLastOrder: values.iLastOrder,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  blLater: values.blLater.toString(),
                  iDaysAhead: values.iDaysAhead,
                  iFirstOrder: values.iFirstOrder,
                  iLastOrder: values.iLastOrder,
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Настройки сохранены');
              }).catch((error) => {
                  console.error(error);
              });

          }
        });
      }

     onChange = (checked) => {
        this.setState({
          blLater: checked,
        })
  
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { blLater } = this.state;
        const labelColSpan = 8;

        return (<div>
            <HeaderSection title="Время" icon="icon-time" />
            <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px", padding: 10}}>
                <FormItem
                    label={
                        <span>
                            Разрешить заказ на потом&nbsp;
                            <Tooltip title="В приложении будет разрешена отправка заказа в нерабочее время и на другой день">
                                <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                            </Tooltip>
                        </span>
                    }
                    >
                    {getFieldDecorator('blLater', { 
                        initialValue: this.props.owner.blLater === "true",
                        valuePropName: 'checked'
                    })(
                        <Switch onChange={this.onChange}/>
                    )}
                </FormItem>
                { blLater ?
                <div>
                    <FormItem
                        label={
                            <span>
                                Максимальное количество дней вперед&nbsp;
                                <Tooltip title="На сколько дней вперед будет разрешено оформление заказа">
                                    <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                                </Tooltip>
                            </span>
                        }
                        abelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('iDaysAhead', {
                            getValueFromEvent: (e) => {
                                const convertedValue = Number(e.currentTarget.value);
                                if (isNaN(convertedValue)) {
                                  return Number(this.props.form.getFieldValue("iDaysAhead"));
                                } else {
                                  return convertedValue;
                                }
                            },
                            initialValue: this.props.owner.iDaysAhead
                        })(
                            <Input prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="7" maxLength="2" />
                        )}
                        </FormItem>
                        <FormItem
                            label={
                                <span>
                                    Первый заказ (минуты)&nbsp;
                                    <Tooltip title="За сколько минут до открытия будет разрешено оформление заказа">
                                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                                    </Tooltip>
                                </span>
                            }
                            abelCol={{ span: labelColSpan }}
                            style={{ marginBottom: 10 }}
                            hasFeedback
                        >
                            {getFieldDecorator('iFirstOrder', {
                                getValueFromEvent: (e) => {
                                    const convertedValue = Number(e.currentTarget.value);
                                    if (isNaN(convertedValue)) {
                                      return Number(this.props.form.getFieldValue("iFirstOrder"));
                                    } else {
                                      return convertedValue;
                                    }
                                },
                                initialValue: this.props.owner.iFirstOrder
                            })(
                                <Input prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="30" maxLength="2"/>
                            )}
                        </FormItem>
                        <FormItem
                            label={
                                <span>
                                    Последний заказ (минуты)&nbsp;
                                    <Tooltip title="За сколько минут до закрытия будет запрещено оформление заказа">
                                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                                    </Tooltip>
                                </span>
                            }
                            abelCol={{ span: labelColSpan }}
                            style={{ marginBottom: 10 }}
                            hasFeedback
                            >
                            {getFieldDecorator('iLastOrder', {
                                getValueFromEvent: (e) => {
                                    const convertedValue = Number(e.currentTarget.value);
                                    if (isNaN(convertedValue)) {
                                      return Number(this.props.form.getFieldValue("iLastOrder"));
                                    } else {
                                      return convertedValue;
                                    }
                                },
                                initialValue: this.props.owner.iLastOrder
                            })(
                                <Input prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="30" maxLength="2"/>
                            )}
                        </FormItem>
                    </div>
                    : null }
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

const WrappedNormalForm = Form.create()(Times);

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