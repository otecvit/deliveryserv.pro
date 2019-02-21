import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Icon, Row, Col, Radio, Divider, Button } from 'antd'

const { Content } = Layout;

class License extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            currentTarif: 1,
            currentPeriodMonth: true,
        }
    }

    onChangeTarif = (e) => {
        this.setState({
          currentTarif: e,
        })      
      }
  
    changePeriod = () => {
        this.setState({
            currentPeriodMonth: !this.state.currentPeriodMonth
        })
    }

    render() {
        const { currentPeriodMonth, currentTarif } = this.state;
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (<div>
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><IconFont type="icon-orders" style={{ fontSize: '16px', marginRight: "10px"}}/>Оплата</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
                <div style={{ padding: 10 }}>
                <Row>
                    <Col>
                        <div className="b-subscription__plan-box">
                            <div className="b-subscription__plan-box__helper">
                                <div className="b-subscription__plan b-subscription__plan-full">
                                    <div className="b-subscription__main">
                                        <span className="b-subscription__main-title">Ваш тарифный план</span>
                                        <div className="b-plans__title b-plans__title-left b-plans__title-sm-marg">Начинающий</div>
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
                <Row>
                <Col>
                    <div className="period-payments">
                    <Radio.Group defaultValue={currentPeriodMonth} onChange={this.changePeriod} buttonStyle="solid">
                        <Radio.Button value={true}>Месяц</Radio.Button>
                        <Radio.Button value={false}>Год</Radio.Button>
                    </Radio.Group>
                    </div>
                </Col>
                </Row>
                <Row gutter={24}>
                <Col span={12}>
                    <div className="subscription-plans-widget" onClick={() => this.onChangeTarif(1)}>
                    <div className={"subscription-plan " + (currentTarif === 1 && "active")} >
                        <div className={"plan-name " + (currentTarif === 1 && "active")}>
                        Начинающий
                        </div>
                        <div className="plan-details">
                        <div className="plan-detail">
                            <p><IconFont type="icon-money"/></p>
                            <p><span>{currentPeriodMonth ? "19$ - месяц" : "190$ - год"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-orders"/></p>
                            <p><span>{currentPeriodMonth ? "До 500 заказов" : "До 6 000 заказов"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-order"/></p>
                            <p><span>0.10$ за заказ сверх лимита</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-timer-sand"/></p>
                            <p><span><span>30 дней бесплатно</span></span></p>
                        </div>
                        </div>
                    </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="subscription-plans-widget" onClick={() => this.onChangeTarif(2)}>
                    <div className={"subscription-plan " + (currentTarif === 2 && "active")} >
                        <div className={"plan-name " + (currentTarif === 2 && "active")}>
                        Профессионал
                        </div>
                        <div className="plan-details">
                        <div className="plan-detail">
                            <p><IconFont type="icon-money"/></p>
                            <p><span>{currentPeriodMonth ? "39$ - месяц" : "390$ - год"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-orders"/></p>
                            <p><span>{currentPeriodMonth ? "До 1 500 заказов" : "До 18 000 заказов"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-order"/></p>
                            <p><span>0.07$ за заказ сверх лимита</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-timer-sand"/></p>
                            <p><span><span>30 дней бесплатно</span></span></p>
                        </div>
                        </div>
                    </div>
                    </div>              
                </Col>
                </Row>
                <Row gutter={24}>
                <Col span={12}>
                    <div className="subscription-plans-widget"  onClick={() => this.onChangeTarif(3)}>
                    <div className={"subscription-plan " + (currentTarif === 3 && "active")} >
                        <div className={"plan-name " + (currentTarif === 3 && "active")}>
                        Премиум
                        </div>
                        <div className="plan-details">
                        <div className="plan-detail">
                            <p><IconFont type="icon-money"/></p>
                            <p><span>{currentPeriodMonth ? "89$ - месяц" : "890$ - год"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-orders"/></p>
                            <p><span>{currentPeriodMonth ? "До 4 000 заказов" : "До 48 000 заказов"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-order"/></p>
                            <p><span>0.05$ за заказ сверх лимита</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-timer-sand"/></p>
                            <p><span><span>30 дней бесплатно</span></span></p>
                        </div>
                        </div>
                    </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="subscription-plans-widget" onClick={() => this.onChangeTarif(4)}>
                    <div className={"subscription-plan " + (currentTarif === 4 && "active")} >
                        <div className={"plan-name " + (currentTarif === 4 && "active")}>
                        Эксперт
                        </div>
                        <div className="plan-details">
                        <div className="plan-detail">
                            <p><IconFont type="icon-money"/></p>
                            <p><span>{currentPeriodMonth ? "169$ - месяц" : "1690$ - год"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-orders"/></p>
                            <p><span>{currentPeriodMonth ? "До 10 000 заказов" : "До 120 000 заказов"}</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-order"/></p>
                            <p><span>0.03$ за заказ сверх лимита</span></p>
                        </div>
                        <div className="plan-detail">
                            <p><IconFont type="icon-timer-sand"/></p>
                            <p><span><span>30 дней бесплатно</span></span></p>
                        </div>
                        </div>
                    </div>
                    </div>              
                </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={12}>
                        <span>Стоимость выбранного тарифного плана</span>
                    </Col>
                    <Col span={12} style = {{ textAlign: 'right' }}>
                        190
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

    }),
    dispatch => ({
    })
)(License)