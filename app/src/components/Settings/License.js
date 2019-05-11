import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Layout, Icon, Row, Col, Radio, Divider, Button } from 'antd'

import TariffPlans, { Tariffs } from '../../items/TariffPlans';
import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;

const CURRENCY = "$"; // валюта


class License extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentTariff: this.props.owner.iTarif !== '0' ? this.props.owner.iTarif : '1',
            currentCost: this.props.owner.iTarif !== '0' ? Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].cost : '1',
            oldNameTariff: this.props.owner.iTarif !== '0' ? Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].name : `Пробный период`, //текущий оплаченный тариф или пробный период
        }

    }

    handleTariff = (tariff) => {
        this.setState({
            currentTariff: Tariffs[Tariffs.findIndex(x => x.idTarif === tariff)].idTarif,
            currentCost: Tariffs[Tariffs.findIndex(x => x.idTarif === tariff)].cost,
        })
    }

    render() {

        const {currentTariff, currentCost, oldNameTariff} = this.state;

        
        return (<div> 
            <HeaderSection title="Оплата" icon="icon-orders" />  
            <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
                <div style={{ padding: 10 }}>
                <Row>
                    <Col>
                        <div className="b-subscription__plan-box">
                            <div className="b-subscription__plan-box__helper">
                                <div className="b-subscription__plan b-subscription__plan-full">
                                    <div className="b-subscription__main">
                                        <span className="b-subscription__main-title">Ваш тарифный план</span>
                                        <div className="b-plans__title b-plans__title-left b-plans__title-sm-marg">{oldNameTariff}</div>
                                        <div>активен до<b> 08 февраля 2019 г.</b></div>
                                    </div>
                                </div>
                            </div>
                            <div className="b-subscription__plan">
                            <Row type="flex" align="middle" gutter={40}>
                                
                                <Col span={12} style = {{ textAlign: 'center', borderRight: '1px solid #d0d0d0' }}>
                                    <div style = {{ fontWeight: 300, fontSize: 22 }}>30 шт.</div>
                                    <div style = {{ fontWeight: 300, fontSize: 11 }}>Количество заказов за последний месяц</div>
                                </Col>
                                
                                <Col span={12} style = {{ textAlign: 'center' }}>
                                    <div style = {{ fontWeight: 300, fontSize: 22, color: "#f00" }}>100 шт. (0.25$)</div>
                                    <div style = {{ fontWeight: 300, fontSize: 11 }}>Превышение лимита заказов по тарифному плану</div>
                                </Col>
                            </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                <TariffPlans onSelectTariff={this.handleTariff} currentTariff = {currentTariff}/>
                <Divider />
                <Row>
                    <Col span={12}>
                        <span>Стоимость выбранного тарифного плана</span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        {currentCost}{CURRENCY}
                    </Col>
                </Row>
                <Divider dashed />
                <Row>
                    <Col span={12}>
                    <span>Превышение лимита в предыдущем периоде</span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        0,25
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={12}>
                    <span><b>ИТОГО</b></span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        <b>190,25</b>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style = {{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            Оплатить
                        </Button>
                    </Col>
                </Row>
                </div>
            </Content>          
        </div>)
    }
}

export default connect(
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
    })
)(License)
