import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Divider, Avatar, Icon, Table, Menu, Radio, Row, Col, Select, message, Popconfirm, Modal, Alert  } from 'antd';

const { Content } = Layout;

class Dashboard extends Component {

  render() {

    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: this.props.optionapp[0].scriptIconUrl,
    });
    
    return (
    <Content style={{ background: '#fff'}}>
      <div style={{ padding: 10 }}>
          <div className="title-section"><Icon type="home" style={{ fontSize: '20px', marginRight: "10px"}}/>Рабочий стол</div>
          <Divider />
          <Row type="flex" justify="space-around" align="middle">
              <Col span={12}>
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">Сегодня</Radio.Button>
                <Radio.Button value="b">День</Radio.Button>
                <Radio.Button value="c">Неделя</Radio.Button>
                <Radio.Button value="d">Месяц</Radio.Button>
                <Radio.Button value="e">Год</Radio.Button>
              </Radio.Group>
              </Col>
              <Col span={12}>

              </Col>
          </Row>
      </div>
    </Content>);
  }
}
export default connect (
    state => ({
        optionapp: state.optionapp,
    }),
    dispatch => ({
    })
  )(Dashboard);




