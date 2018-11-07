import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Tooltip, Button, Icon, Table, Menu, Badge, Row, Col, Select, message, Popconfirm, Modal, Alert  } from 'antd';

const { Content } = Layout;

class HeaderStatus extends Component {
    
    render() {
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });


        return (
            <div>
            <Content style={{ background: '#fff'}}>
                <Row>
                    <Col span={22}>
                    </Col>
                    <Col span={2}>
                        <div style={{ textAlign: "right"}}>
                            <Badge status="success"><IconFont type="icon-user" style={{ fontSize: "20px" }}/></Badge>
                            <Tooltip placement="bottomRight" title={this.props.optionapp[0].statusCloud ? "Соединение установлено" : "Проверьте подключение к сети"}>
                                <Badge status={this.props.optionapp[0].statusCloud ? "success" : "error" }>
                                    <IconFont type="icon-cloudcomputing" style={{ fontSize: "20px", marginLeft: "6px" }}/>
                                </Badge>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
                </Content>
            </div>);
    }

}

export default connect (
    state => ({
      optionapp: state.optionapp,
    }),
    dispatch => ({

    })
  )(HeaderStatus);