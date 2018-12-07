import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

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
                const url = this.props.optionapp[0].serverUrl + "/EditOwner.php"; // изменяем категорию
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
                  chName: values.chName,
                  chTagline: values.chTagline,
                  chEmailStore: values.chEmailStore,
                  chTimeZone: values.chTimeZone,
                  chCurrency: values.chCurrency,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  chUID: this.props.owner.chUID,
                  chName: values.chName,
                  chTagline: values.chTagline,
                  chEmailStore: values.chEmailStore,
                  chTimeZone: values.chTimeZone,
                  chCurrency: values.chCurrency,
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
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><Icon type="clock-circle" style={{ fontSize: '16px', marginRight: "10px"}}/>Время</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                <FormItem
                    label="Разрешить заказ на потом"
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
                        label="Максимальное количество дней вперед"
                        abelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('chName', {
                            rules: [],
                            initialValue: this.props.owner.chName
                        })(
                            <Input prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="7" />
                        )}
                        </FormItem>
                        <FormItem
                        label="Первый заказ (минуты)"
                        abelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('chSlogan', {
                            rules: [],
                            initialValue: this.props.owner.chTagline
                        })(
                            <Input prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="30" />
                        )}
                        </FormItem>
                        <FormItem
                            label="Последний заказ (минуты)"
                            abelCol={{ span: labelColSpan }}
                            style={{ marginBottom: 10 }}
                            hasFeedback
                            >
                            {getFieldDecorator('chEmailStore', {
                                rules: [],
                                initialValue: this.props.owner.chEmailStore
                            })(
                                <Input prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="30" />
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