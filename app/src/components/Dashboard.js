import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Divider, Avatar, Icon, Table, Menu, Radio, Row, Col, Select, message, Popconfirm, Modal, Alert, Button  } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';

const ButtonGroup = Button.Group;

const { Content } = Layout;

class Dashboard extends Component {

  constructor(props) {
    super(props);
   
    moment.locale('ru'); // устанавливаем локализацию
    
    this.state = {
        timePeriod: "1",
        currValuePeriod: moment().format('LL'),
        iCurrDiff: 0,
    };  
  }

  onChangeTimePeriod = (e) => {
    this.setState({
      timePeriod: e.target.value,
      iCurrDiff: 0,
    })
  }

  onChangePrev = (e) => {
    const { iCurrDiff } = this.state;
    
    this.setState({
      iCurrDiff: iCurrDiff - 1,
    }) 
    this.setCurrValuePeriod(iCurrDiff - 1);
  }

  onChangeNext = (e) => {
    const { iCurrDiff } = this.state;
    this.setState({
      iCurrDiff: iCurrDiff + 1,
    }) 
    this.setCurrValuePeriod(iCurrDiff + 1);
  }

  setCurrValuePeriod = (iCurrDiff) => {
    const { timePeriod } = this.state;

    switch (timePeriod) {
      case '2': {
        this.setState({
          currValuePeriod: moment().add(iCurrDiff, 'days').format('LL'),
        })
      } break;
      case '3': {
        this.setState({
          currValuePeriod: moment().add(iCurrDiff, 'week').startOf('week').format('LL') + " - " + moment().add(iCurrDiff, 'week').endOf('week').format('LL'),
        })        
      } break;
      case '4': { 
        this.setState({
          currValuePeriod: moment().add(iCurrDiff, 'month').format('MMMM YYYY'),
        })
      } break;
      case '5': {

      } break;

    }

    
  }




  render() {

    const { timePeriod, currValuePeriod, iCurrDiff } = this.state;

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
                <Radio.Group defaultValue="1" buttonStyle="solid" onChange={this.onChangeTimePeriod}>
                  <Radio.Button value="1">Сегодня</Radio.Button>
                  <Radio.Button value="2">День</Radio.Button>
                  <Radio.Button value="3">Неделя</Radio.Button>
                  <Radio.Button value="4">Месяц</Radio.Button>
                  <Radio.Button value="5">Год</Radio.Button>
                </Radio.Group>
                </Col>
                <Col span={12}>

                </Col>
            </Row>
        </div>
      </Content>
      <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
      <div style={{ padding: 20 }}>
      <Row type="flex" justify="space-around" align="middle" style={{ margin: '5px 0 20px 0' }}>
          <Col span={12}>
            <div style = {{ fontWeight: 600 }}>{currValuePeriod}</div>
          </Col>
          <Col span={12} style = {{ textAlign: 'right' }}>
          { timePeriod != "1" &&
            <ButtonGroup>
              <Button onClick={this.onChangePrev}><Icon type="left" /></Button>
              <Button onClick={this.onChangeNext} value="2"><Icon type="right" /></Button>
            </ButtonGroup>
          }
          </Col>
        </Row>     
        <Divider />   
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




