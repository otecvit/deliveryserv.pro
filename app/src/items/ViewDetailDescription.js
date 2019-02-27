import React, { Component, Fragment } from 'react'
import { Row, Col } from 'antd'

class ViewDetailDescription extends Component {
    render() {
        return (
            <Row gutter={10} style={{ marginBottom: 10 }}>
                <Col span={7} style={{ textAlign: 'right' }}>
                    <b>{this.props.title}</b>
                </Col>
                <Col span={17}>
                    {this.props.value}
                </Col>
            </Row>
        )
    }
}

export default ViewDetailDescription