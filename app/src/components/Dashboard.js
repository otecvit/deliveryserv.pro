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
    <div>
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
      </Content>
      <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
      <div style={{ padding: 20 }}>
      <Row type="flex" justify="space-around" align="middle" style={{ margin: '5px 0 15px 0' }}>
          <Col span={24}>
          <div style = {{ fontWeight: 600 }}>31 января 2019 г.</div>
          </Col>
        </Row>        
        <Row type="flex" align="middle" gutter={45}>
        <Col span={6}>
            <IconFont type="icon-svgmoneybag" style = {{ fontSize: 80 }}/>
          </Col>
          <Col span={6} style = {{ textAlign: 'right' }}>
            <div style = {{ fontWeight: 600 }}>Продажи</div>
            <div style = {{ fontWeight: 300, fontSize: 25 }}>252.00 BYN</div>
            
          </Col>
          <Col span={6}>
            <IconFont type="icon-shopping" style = {{ fontSize: 80 }}/>
          </Col>
          <Col span={6} style = {{ textAlign: 'right' }}>
            <div style = {{ fontWeight: 600 }}>Заказы</div>
            <div style = {{ fontWeight: 300, fontSize: 25 }}>10</div>
          </Col>
        </Row>
      </div>
      </Content>
    </div>
    );
  }
}
export default connect (
    state => ({
        optionapp: state.optionapp,
    }),
    dispatch => ({
    })
  )(Dashboard);




