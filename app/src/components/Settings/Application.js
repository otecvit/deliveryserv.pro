import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Layout, Switch, Icon, Button, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd'
import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;

class Application extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;

        return (<Fragment>
            <HeaderSection title="Мобильное приложение" icon="icon-menu" />
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                    <div style={{ padding: "10px 10px 0 10px" }}>Сформируйте запрос, а наши специалисты подготовят и опубликуют мобильное приложение в Play Market и App Store. Срок публикации в Play Market от 3 рабочих дней, в App Store от 14 рабочих дней.</div>
                    <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px", padding: 10}}>
                        <FormItem
                            label="Play Market"
                            >
                            {getFieldDecorator('blCashCourier', { 
                                initialValue: this.props.owner.blCashCourier === "true",
                                valuePropName: 'checked'
                            })(
                                <Switch onChange={this.onChangeCashCourier}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="App Store"
                            >
                            {getFieldDecorator('blCardCourier', { 
                                initialValue: this.props.owner.blCardCourier === "true",
                                valuePropName: 'checked'
                            })(
                                <Switch onChange={this.onChangeCardCourier}/>
                            )}
                        </FormItem>
                        <FormItem>
                        <Button type="primary" htmlType="submit">
                            <Icon type="plus"/>Отправить запрос
                        </Button>
                        </FormItem>
                </Form>          
                </div>
            </Content>
            </Fragment>);
    }
}

const WrappedNormalForm = Form.create()(Application);

export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
    }
  ))(WrappedNormalForm);
