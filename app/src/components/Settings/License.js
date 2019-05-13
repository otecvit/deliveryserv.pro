import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Layout, Icon, Row, Col, Radio, Divider, Button } from 'antd'
import moment from 'moment'
import 'moment/locale/ru'

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
            arrStatistics: [  { iStatus: "0", CountOrder: 0, SumOrder: 0},
                                { iStatus: "5", CountOrder: 0, SumOrder: 0}, 
                                { iStatus: "6", CountOrder: 0, SumOrder: 0}],   
            orderExcessLimit: 0, // превышение лимита заказов по тарифному плану
            costExcessLimit: 0, // Доплата за превышение лимита заказов по тарифному плану
        }

    }

    handleTariff = (tariff) => {
        this.setState({
            currentTariff: Tariffs[Tariffs.findIndex(x => x.idTarif === tariff)].idTarif,
            currentCost: Tariffs[Tariffs.findIndex(x => x.idTarif === tariff)].cost,
        })
    }

    componentDidMount() {
        this.selectStatistics();
    }

    selectStatistics = () => {
        
        const { dLastPayment } = this.props.owner;
        const url = this.props.optionapp[0].serverUrl + "/SelectStatistics.php";
        
        //const dEndSubscription = moment([this.props.owner.dEndSubscription[0], this.props.owner.dEndSubscription[1]-1, this.props.owner.dEndSubscription[2]]).format(`LL`);

        const dStart = moment([dLastPayment[0], dLastPayment[1]-1, dLastPayment[2]]).format('YYYY-MM-DD 00:00:00');
        const dEnd = moment().format('YYYY-MM-DD 23:59:59');
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(
            {
            chUID: this.props.owner.chUID,
            dStart: dStart,
            dEnd: dEnd,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {

            // 0-4 - текущие
            // 5 - завершенные
            // 6 - отменено
            var newArr = [  { iStatus: "0", CountOrder: 0, SumOrder: 0},
                            { iStatus: "5", CountOrder: 0, SumOrder: 0}, 
                            { iStatus: "6", CountOrder: 0, SumOrder: 0}];

            responseJson.orders.map(item => {
            switch (item.iStatus) {
                case "5": {
                newArr[1].CountOrder += parseFloat(item.CountOrder, 10);
                newArr[1].SumOrder += parseFloat(item.SumOrder, 10);
                } break;
                case "6": {
                newArr[2].CountOrder += parseFloat(item.CountOrder, 10);
                newArr[2].SumOrder += parseFloat(item.SumOrder, 10);
                } break;
                default: {
                newArr[0].CountOrder += parseFloat(item.CountOrder, 10);
                newArr[0].SumOrder += parseFloat(item.SumOrder, 10);
                }
            }
            });

            this.setState({
                arrStatistics: newArr,
            })

            // проверяем превышение лимита
            this.checkExcessLimit();

        })
        .catch((error) => {
        console.error(error);
        });
    }

    // проверка превышения лимита
    checkExcessLimit = () => {
        //Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].countOrders
        const { arrStatistics } = this.state;
        const currentOrder = arrStatistics[0].CountOrder + arrStatistics[1].CountOrder; //текущее количество заказов
        const countOrdersLimit = Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].countOrders; // лимит заказов по тарифу
        const costOverLimit = Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].costOverLimit; // стоимость заказа сверх лимита

        if ( currentOrder > countOrdersLimit) {
            const orderExcessLimit = currentOrder - countOrdersLimit;
            const costExcessLimit = orderExcessLimit * costOverLimit;
            this.setState({
                orderExcessLimit: orderExcessLimit,
                costExcessLimit: costExcessLimit,
            })
        }
    }

    render() {



        const {currentTariff, currentCost, oldNameTariff, arrStatistics, costExcessLimit, orderExcessLimit} = this.state;
        const dEndSubscription = moment([this.props.owner.dEndSubscription[0], this.props.owner.dEndSubscription[1]-1, this.props.owner.dEndSubscription[2]]).format(`LL`);
        const chOrderLimit = orderExcessLimit !== 0 ? `${orderExcessLimit} шт. (${costExcessLimit}${CURRENCY})` : `0 шт.`;


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
                                        <div>активен до<b> {dEndSubscription}</b></div>
                                    </div>
                                </div>
                            </div>
                            <div className="b-subscription__plan">
                            <Row type="flex" align="middle" gutter={40}>
                                
                                <Col span={12} style = {{ textAlign: 'center', borderRight: '1px solid #d0d0d0' }}>
                                    <div style = {{ fontWeight: 300, fontSize: 22 }}>{arrStatistics[0].CountOrder + arrStatistics[1].CountOrder} шт.</div>
                                    <div style = {{ fontWeight: 300, fontSize: 11 }}>Количество заказов с момента последней оплаты</div>
                                </Col>
                                
                                <Col span={12} style = {{ textAlign: 'center' }}>
                                    <div style = {{ fontWeight: 300, fontSize: 22}}>{chOrderLimit}</div>
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
                        {costExcessLimit}{CURRENCY}
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
