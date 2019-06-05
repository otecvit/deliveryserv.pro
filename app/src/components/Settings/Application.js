import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Layout, Switch, Icon, Button, Row, Col, Form, Select, message, Popconfirm, Modal } from 'antd'
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
        const { idCustomer, chUID, chName } = this.props.owner;

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
                            idCustomer: idCustomer,
                            chName: chName,
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
                        message.success('Запрос отправлен');
                    }).catch((error) => {
                        console.error(error);
                    });
                
            }
        });
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { dDateRequest, chPathPlayMarket, chPathAppStore } = this.props.owner;
        const { serverUrlStart } = this.props.optionapp[0];

        return (<Fragment>
            <HeaderSection title="Мобильное приложение" icon="icon-menu" />
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                    { !dDateRequest ? 
                    <Fragment>
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
                </Fragment> : 
                    <Fragment>
                        { chPathPlayMarket === "" && chPathAppStore === "" ?
                        <div style={{ padding: "10px" }}>Мы работаем над приложением. После публикации ссылки будут размещены на данной странице.</div> :
                        <Fragment>
                            <div style={{ padding: "10px" }}>Ссылка на приложение.</div> 
                            { chPathPlayMarket !== "" && 
                            <Row style={{ padding: "10px 10px 5px 10px" }}>
                                <Col>
                                    <a href={chPathPlayMarket}><img src={`${serverUrlStart}/image/crm/GooglePlayLogo.jpg`} style={{ width: 200 }}/></a>
                                </Col>
                            </Row> }
                            { chPathAppStore !== "" && 
                            <Row style={{ padding: "5px 10px 10px 10px" }}>
                                <Col>
                                    <a href={chPathAppStore}><img src={`${serverUrlStart}/image/crm/AppStoreLogo.jpg`} style={{ width: 200 }}/></a>
                                </Col>
                            </Row>}
                        </Fragment>
                        }
                    </Fragment>}
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
