import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Layout, Icon, Row, Col, Radio, Divider, Button } from 'antd'

export const Tariffs = [
    {
        idTarif: "1",
        name: "Начинающий",
        period: "месяц",
        cost: "19",
        countOrders: "500",
        costOverLimit: "0.10",
    }, {
        idTarif: "2",
        name: "Профессионал",
        period: "месяц",
        cost: "39",
        countOrders: "1 500",
        costOverLimit: "0.07",
    },{
        idTarif: "3",
        name: "Премиум",
        period: "месяц",
        cost: "89",
        countOrders: "4 000",
        costOverLimit: "0.05",
    }, {
        idTarif: "4",
        name: "Эксперт",
        period: "месяц",
        cost: "169",
        countOrders: "10 000",
        costOverLimit: "0.03",
    }, {
        idTarif: "5",
        name: "Начинающий",
        period: "год",
        cost: "190",
        countOrders: "6 000",
        costOverLimit: "0.10",
    }, {
        idTarif: "6",
        name: "Профессионал",
        period: "год",
        cost: "390",
        countOrders: "18 000",
        costOverLimit: "0.07",
    }, {
        idTarif: "7",
        name: "Премиум",
        period: "год",
        cost: "890",
        countOrdersMonth: "4 000",
        costOverLimit: "0.05",
    }, {
        idTarif: "8",
        name: "Эксперт",
        period: "год",
        cost: "1690",
        countOrders: "120 000",
        costOverLimit: "0.03",
    },
];

const AMOUNT_TARIFF = 4; // количество тарифов для отображения
const CURRENCY = "$"; // валюта

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_888167_3jquks63an9.js",
  });

const TemplateTariff = ({ tarif, active, onClick }) => (
        <div className="subscription-plans-widget" onClick={onClick}>
            <div className={"subscription-plan " + (active && "active")} >
                <div className={"plan-name " + (active && "active")}>
                {tarif.name}
                </div>
                <div className="plan-details">
                <div className="plan-detail">
                    <p><IconFont type="icon-money"/></p>
                    <p><span>{tarif.cost}{CURRENCY} - {tarif.period}</span></p>
                </div>
                <div className="plan-detail">
                    <p><IconFont type="icon-orders"/></p>
                    <p><span>До {tarif.countOrders} заказов</span></p>
                </div>
                <div className="plan-detail">
                    <p><IconFont type="icon-order"/></p>
                    <p><span>{tarif.costOverLimit}{CURRENCY}  за заказ сверх лимита</span></p>
                </div>
                <div className="plan-detail">
                    <p><IconFont type="icon-timer-sand"/></p>
                    <p><span><span>30 дней бесплатно</span></span></p>
                </div>
                </div>
            </div>
        </div>

);

class TariffPlans extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentTarif: this.props.currentTariff,
            currentPeriod: this.props.currentTariff ? Tariffs[Tariffs.findIndex(x => x.idTarif === this.props.currentTariff)].period : "месяц",
        }
    }

    onChangeTarif = (e, idTarif) => {
        this.setState({
          currentTarif: idTarif,
        })    
        this.props.onSelectTariff(idTarif);  // передаем id тарифа в родителя
    }
  
    changePeriod = ({ target: { value }}) => {
        const currentTarif = Tariffs[this.сhangeTarifId()].idTarif; //новый текущий тариф
        this.setState({
            currentPeriod: value,
            currentTarif: currentTarif,
        });
        this.props.onSelectTariff(currentTarif);  // передаем id тарифа в родителя
    }

    // при изменении периода (месяц/год) высчитываем индекс тарифа 
    сhangeTarifId = () => {
        // находим индекс текущего массива
        const indexCurrentTariff = Tariffs.findIndex(x => x.idTarif === this.state.currentTarif);
        // возвращаем новый индекс 
        if (indexCurrentTariff >= AMOUNT_TARIFF) {
            return indexCurrentTariff - AMOUNT_TARIFF;
        }
        else {
           return indexCurrentTariff + AMOUNT_TARIFF; 
        }
    }

    render(){
        const { currentPeriod, currentTarif } = this.state;

        return (
            <Fragment>
                <Row>
                <Col>
                    <div className="period-payments">
                    <Radio.Group defaultValue={currentPeriod} onChange={this.changePeriod} buttonStyle="solid">
                        <Radio.Button value="месяц">Месяц</Radio.Button>
                        <Radio.Button value="год">Год</Radio.Button>
                    </Radio.Group>
                    </div>
                </Col>
                </Row>
                <Row>                
                    { Tariffs.map((item, index) =>
                        item.period === currentPeriod &&
                        <TemplateTariff 
                            key = {index} 
                            tarif = { item } 
                            active = { currentTarif === item.idTarif ? true : false } 
                            onClick = {(e) => this.onChangeTarif(e, item.idTarif)}/>
                    )
                    }
                </Row>
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        optionapp: state.optionapp,

    }),
    dispatch => ({
    })
)(TariffPlans)