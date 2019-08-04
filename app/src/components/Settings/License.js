import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Layout, Row, Col, Modal, Divider, Button } from 'antd'
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
            currentCost: this.props.owner.iTarif !== '0' ? Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].cost : Tariffs[0].cost,
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
        const url = `${this.props.optionapp[0].serverUrl}/SelectStatistics.php`;
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
        const countOrdersLimit = this.props.owner.iTarif !== '0' ? Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].countOrders : 10000; // лимит заказов по тарифу
        const costOverLimit = this.props.owner.iTarif !== '0' ? Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.owner.iTarif)].costOverLimit : 0.03; // стоимость заказа сверх лимита

        if ( currentOrder > countOrdersLimit) {
            const orderExcessLimit = currentOrder - countOrdersLimit;
            const costExcessLimit = orderExcessLimit * costOverLimit;
            this.setState({
                orderExcessLimit: orderExcessLimit,
                costExcessLimit: costExcessLimit,
            })
        }
    }

    // обработка нажатия "Перейти к оплате"
    goToPayment = () => {
        Modal.success({
          title: 'Оплата',
          content: 'Оплата проведена успешно...',
        });
    }


    render() {



        const {currentTariff, currentCost, oldNameTariff, arrStatistics, costExcessLimit, orderExcessLimit} = this.state;
        const { serverUrlStart } = this.props.optionapp[0];
        const dEndSubscription = moment([this.props.owner.dEndSubscription[0], this.props.owner.dEndSubscription[1]-1, this.props.owner.dEndSubscription[2]]).format(`LL`);
        const chOrderLimit = orderExcessLimit !== 0 ? `${orderExcessLimit} шт. (${costExcessLimit}${CURRENCY})` : `0 шт.`;
        const totalCost = Number(currentCost) + Number(costExcessLimit);

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
                <Divider style={{ margin: '3px 0' }}/>
                <Row>
                    <Col span={12}>
                        <span>Стоимость выбранного тарифного плана</span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        {Number(currentCost).toFixed(2)}{CURRENCY}
                    </Col>
                </Row>
                <Divider dashed style={{ margin: '3px 0' }}/>
                <Row>
                    <Col span={12}>
                    <span>Превышение лимита в предыдущем периоде</span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        {Number(costExcessLimit).toFixed(2)}{CURRENCY}
                    </Col>
                </Row>
                <Divider style={{ margin: '3px 0' }}/>
                <Row>
                    <Col span={12}>
                    <span><b>ИТОГО</b></span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        <b>{Number(totalCost).toFixed(2)}{CURRENCY}</b>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style = {{ textAlign: 'right', margin: '15px 0' }}>
                        <Button type="primary" onClick={this.goToPayment}>
                            Перейти к оплате
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style = {{ textAlign: 'center', margin: '25px 0 15px 0', fontSize: 22 }}>Способы оплаты</Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={4} style = {{ textAlign: 'center'}}><img src={`${serverUrlStart}/image/crm/visa_verified2.png`} /></Col>
                    <Col span={4} style = {{ textAlign: 'center'}}><img src={`${serverUrlStart}/image/crm/visa.png`} /></Col>
                    <Col span={4} style = {{ textAlign: 'center'}}><img src={`${serverUrlStart}/image/crm/mastercard-securecode.png`} /></Col>
                    <Col span={4} style = {{ textAlign: 'center'}}><img src={`${serverUrlStart}/image/crm/master-card.png`} /></Col>
                </Row>
                <Row>
                    <Col span={24} style = {{ textAlign: 'center', margin: '45px 0 15px 0', fontSize: 22 }}>Вопросы и ответы</Col>
                </Row>
                <Row style={{ marginBottom: 15}}>
                    <Col span={24}>
                        <p style={{fontSize: 16, marginBottom: 5}}>Что означает 30 дней бесплатно?</p>
                        <p style={{fontSize: 12}}>Это период, во время которого вы абсолютно бесплатно можете использовать все функции системы, а также обращаться в службу поддержки пользователей. Оплатите подписку в любой момент, и оставшиеся дни пробного периода мы добавим к оплаченному.</p>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 15}}>
                    <Col span={24}>
                        <p style={{fontSize: 16, marginBottom: 5}}>В чем разница между тарифными планами?</p>
                        <p style={{fontSize: 12}}>Тарифные планы отличаются доступными возможностями, количеством заказов и стоимостью заказа сверх лимита.</p>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 15}}>
                    <Col span={24}>
                        <p style={{fontSize: 16, marginBottom: 5}}>Как я могу оплатить подписку?</p>
                        <p style={{fontSize: 12}}>К оплате принимаются банковские карты Visa или MasterCard. Цены на сайте указаны в долларах, но вы можете совершить оплату картой в любой валюте. При этом будет списана сумма, равная указанной цене в долларах по курсу банка, выпустившего вашу карту.</p>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 15}}>
                    <Col span={24}>
                        <p style={{fontSize: 16, marginBottom: 5}}>Я могу перейти на другой тарифный план?</p>
                        <p style={{fontSize: 12}}>Да, вы в любой момент можете перейти с одного тарифного плана на любой другой.</p>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 15}}>
                    <Col span={24}>
                        <p style={{fontSize: 16, marginBottom: 5}}>Что произойдет, когда моя подписка закончится?</p>
                        <p style={{fontSize: 12}}>По окончании подписки вы не сможете просматривать заказы и список клиентов. При этом вы сохраните доступ ко всей информации в своем аккаунте (адреса, категории, товары и т.д.). Также пользователям мобильного приложения будет выдаваться предупреждение о невозможности заказа.</p>
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
