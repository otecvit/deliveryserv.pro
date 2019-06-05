import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Layout, Switch, Icon, Button, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd'
import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;

class Application extends Component {

    state = {
        blPlayMarket: true,
        blAppStore: true,
    }

    onChangeAppStore = () => {
        const { blAppStore } = this.state;
        this.setState ({
            blAppStore: !blAppStore
        });
    }

    onChangePlayMarket = () => {
        const { blPlayMarket } = this.state;
        this.setState ({
            blPlayMarket: !blPlayMarket,
        })
    }

    handleSubmit = (e) => {
        const { blPlayMarket, blAppStore } = this.state;
        const { chUID } = this.props.owner;

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                    var val = {};
                    const url = `${this.props.optionapp[0].serverUrl}/GenerateApplication.php`; // изменяем категорию
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(
                        {
                        chUID: chUID,
                        blPlayMarket:  blPlayMarket ? "1" : "0",
                        blAppStore: blAppStore ? "1" : "0",
                        })
                    }).then((response) => response.json()).then((responseJsonFromServer) => {
                        val = {
                            blPlayMarket:  blPlayMarket,
                            blAppStore: blAppStore,
                            dDateRequest: responseJsonFromServer.dDateRequest
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

        return (<Fragment>
            <HeaderSection title="Мобильное приложение" icon="icon-menu" />
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                    <div style={{ padding: "10px 10px 0 10px" }}>Сформируйте запрос, а наши специалисты подготовят и опубликуют мобильное приложение в Play Market и App Store. Срок публикации в Play Market от 3 рабочих дней, в App Store от 14 рабочих дней.</div>
                    <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px", padding: 10}}>
                        <FormItem
                            label="Play Market"
                            >
                            {getFieldDecorator('blPlayMarket', { 
                                initialValue: true,
                                valuePropName: 'checked'
                            })(
                                <Switch onChange={this.onChangePlayMarket}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="App Store"
                            >
                            {getFieldDecorator('blAppStore', { 
                                initialValue: true,
                                valuePropName: 'checked'
                            })(
                                <Switch onChange={this.onChangeAppStore}/>
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
        onEdit: (data) => {
            dispatch({ type: 'EDIT_OWNER', payload: data});
        },
    }
  ))(WrappedNormalForm);
