import React, { Component, Fragment } from 'react'
import { Icon, Layout, Row, Col, Alert } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import HeaderStatus from '../components/HeaderStatus'

const { Content } = Layout;

class HeaderSection extends Component {

    // склонение числительных
    declOfNum = (titles) => {
        var number = Math.abs(number);
        var cases = [2, 0, 1, 1, 1, 2];
        return function(number){
            return  titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
        }
    };/////////

    render() {
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
        });

        return (
            <Fragment>
            <Content style={{ background: '#fff', padding: '12px 20px'}}>
            <Row>
                <Col span={22} style={{ marginTop: 5 }}>
                    <div className="title-section"><IconFont type={this.props.icon} style={{ fontSize: '16px', marginRight: "10px"}}/>{this.props.title}</div>
                </Col>
                <Col span={2} style={{ textAlign: 'right', marginTop: 5 }}>
                    <HeaderStatus />
                </Col>
            </Row>
            </Content> 
            { this.props.owner.NewOrderPrint !== "0" && this.props.routing.location.pathname !== '/orders' ? <Alert 
                                        message={<Fragment>
                                                    {this.props.owner.NewOrderPrint} {this.declOfNum(['новый заказ','новых заказа','новых заказов'])(this.props.owner.NewOrderPrint)} <Link to="orders" className="alert-order">Перейти к заказам</Link>
                                                </Fragment>}  
                                        type="info" 
                                        style={{ margin: '16px 0', textAlign: "center" }} 
                                        className="alert-order"/> : null }

            </Fragment>

        );
    }
} 

export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
        routing: state.routing,
    }))(HeaderSection);