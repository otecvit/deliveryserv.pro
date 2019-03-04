import React, { Component } from 'react'
import { Icon, Layout, Row, Col } from 'antd'
import { connect } from 'react-redux'

import HeaderStatus from '../components/HeaderStatus'

const { Content } = Layout;

class HeaderSection extends Component {
    render() {
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
        });

        return (
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
        );
    }
} 

export default connect (
    state => ({
        optionapp: state.optionapp,
    }))(HeaderSection);