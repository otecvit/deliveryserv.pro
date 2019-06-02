import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Divider, Icon, Radio, Row, Col, Button  } from 'antd'
import moment from 'moment'
import 'moment/locale/ru'

import HeaderSection from '../items/HeaderSection'

const ButtonGroup = Button.Group;

const { Content } = Layout;

class Dashboard extends Component {

  constructor(props) {
    super(props);
   
    moment.locale('ru'); // устанавливаем локализацию
    
    this.state = {
        timePeriod: "1",
        currValuePeriod: moment().format('LL'),
        arrStatistics: [  { iStatus: "0", CountOrder: 0, SumOrder: 0},
                          { iStatus: "5", CountOrder: 0, SumOrder: 0}, 
                          { iStatus: "6", CountOrder: 0, SumOrder: 0}],
        iCurrDiff: 0,
    };  
  }

  onChangeTimePeriod = (e) => {
    this.setState({
      timePeriod: e.target.value,
      iCurrDiff: 0,
    })

    this.setCurrValuePeriod(0, e.target.value);
    
  }

  onChangePrev = (e) => {
    const { iCurrDiff } = this.state;
    
    this.setState({
      iCurrDiff: iCurrDiff - 1,
    }) 
    this.setCurrValuePeriod(iCurrDiff - 1, this.state.timePeriod);
  }

  onChangeNext = (e) => {
    const { iCurrDiff } = this.state;
    this.setState({
      iCurrDiff: iCurrDiff + 1,
    }) 
    this.setCurrValuePeriod(iCurrDiff + 1, this.state.timePeriod);
  }

  setCurrValuePeriod = (iCurrDiff, timePeriod) => {

    var dStart = moment().format('YYYY-MM-DD 00:00:00');
    var dEnd = moment().format('YYYY-MM-DD 23:59:59');

    switch (timePeriod) {
      case '2': {
        this.setState({
          currValuePeriod: moment().add(iCurrDiff, 'days').format('LL'),
        });
        dStart = moment().add(iCurrDiff, 'days').format('YYYY-MM-DD 00:00:00');
        dEnd = moment().add(iCurrDiff, 'days').format('YYYY-MM-DD 23:59:59');
      } break;
      case '3': {
        this.setState({
          currValuePeriod: moment().add(iCurrDiff, 'week').startOf('week').format('ll') + " - " + moment().add(iCurrDiff, 'week').endOf('week').format('ll'),
        })        
        dStart = moment().add(iCurrDiff, 'week').startOf('week').format('YYYY-MM-DD 00:00:00');
        dEnd = moment().add(iCurrDiff, 'week').endOf('week').format('YYYY-MM-DD 23:59:59');
      } break;
      case '4': { 
        this.setState({
          currValuePeriod: this.capitalizeFirstLetter(moment().add(iCurrDiff, 'month').format('MMMM YYYY г.')),
        })
        dStart = moment().add(iCurrDiff, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
        dEnd = moment().add(iCurrDiff, 'month').endOf('month').format('YYYY-MM-DD 23:59:59');
      } break;
      case '5': {
        this.setState({
          currValuePeriod: moment().add(iCurrDiff, 'year').format('YYYY г.'),
        })
        dStart = moment().add(iCurrDiff, 'year').startOf('year').format('YYYY-MM-DD 00:00:00');
        dEnd = moment().add(iCurrDiff, 'year').endOf('year').format('YYYY-MM-DD 23:59:59');
      } break;

    }

    // получаем статистику из базы
    const url = `${this.props.optionapp[0].serverUrl}/SelectStatistics.php`;
   
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

        })
        .catch((error) => {
          console.error(error);
        });
        
  }

  // первая заглавная буква
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  render() {

    const { timePeriod, currValuePeriod, arrStatistics } = this.state;

    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: this.props.optionapp[0].scriptIconUrl,
    });

    return (
    <div>
      <HeaderSection title="Рабочий стол" icon="icon-home" />

      <Content style={{ background: '#fff', margin: '16px 0' }}>
      <div style={{ padding: 20 }}>
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
      <Divider />
      <Row type="flex" justify="space-around" align="middle" style={{ margin: '5px 0 15px 0' }}>
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
            <div style = {{ fontWeight: 300, fontSize: 25 }}>{(arrStatistics[0].SumOrder + arrStatistics[1].SumOrder).toFixed(2)}  {this.props.owner.chCurrency}</div>
            
          </Col>
          <Col span={6}>
            <IconFont type="icon-shopping" style = {{ fontSize: 80 }}/>
          </Col>
          <Col span={6} style = {{ textAlign: 'right' }}>
            <div style = {{ fontWeight: 600 }}>Заказы</div>
            <div style = {{ fontWeight: 300, fontSize: 25 }}>{arrStatistics[0].CountOrder + arrStatistics[1].CountOrder}</div>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" justify="space-around" align="middle" style={{ margin: '5px 0 20px 0' }}>
          <Col span={24}>
            <div style = {{ fontWeight: 600 }}>Статистика заказов</div>
          </Col>
        </Row>
        <Row type="flex" align="middle" gutter={45}>
          <Col span={8}>
            <Row>
              <Col span={24}><div style = {{ fontWeight: 600, fontSize: 12 }}>Завершенные</div></Col>
            </Row>
            <Divider style = {{ margin: '5px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Сумма</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right' }}>{arrStatistics[1].SumOrder.toFixed(2)}  {this.props.owner.chCurrency}</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Количество</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right'  }}>{arrStatistics[1].CountOrder} шт.</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Процент</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right'  }}>{arrStatistics[1].CountOrder != 0 ? Math.round(arrStatistics[1].CountOrder / (arrStatistics[0].CountOrder + arrStatistics[1].CountOrder + arrStatistics[2].CountOrder) * 100) : "0"}%</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={24}><div style = {{ fontWeight: 600, fontSize: 12 }}>Текущие</div></Col>
            </Row>
            <Divider style = {{ margin: '5px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Сумма</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right' }}>{arrStatistics[0].SumOrder.toFixed(2)}  {this.props.owner.chCurrency}</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Количество</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right'  }}>{arrStatistics[0].CountOrder} шт.</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Процент</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right'  }}>{arrStatistics[0].CountOrder != 0 ? Math.round(arrStatistics[0].CountOrder / (arrStatistics[0].CountOrder + arrStatistics[1].CountOrder + arrStatistics[2].CountOrder) * 100) : "0"}%</div></Col>
            </Row>      
            <Divider dashed style = {{ margin: '1px 0' }}/>      
          </Col>
          <Col span={8}>
            <Row>
              <Col span={24}><div style = {{ fontWeight: 600, fontSize: 12 }}>Отменено</div></Col>
            </Row>
            <Divider style = {{ margin: '5px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Сумма</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right' }}>{arrStatistics[2].SumOrder.toFixed(2)}  {this.props.owner.chCurrency}</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Количество</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right'  }}>{arrStatistics[2].CountOrder} шт.</div></Col>
            </Row>
            <Divider dashed style = {{ margin: '1px 0' }}/>
            <Row>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12 }}>Процент</div></Col>
              <Col span={12}><div style = {{ fontWeight: 500, fontSize: 12, textAlign: 'right'  }}>{arrStatistics[2].CountOrder != 0 ? Math.round(arrStatistics[2].CountOrder / (arrStatistics[0].CountOrder + arrStatistics[1].CountOrder + arrStatistics[2].CountOrder) * 100) : "0"}%</div></Col>
            </Row>     
            <Divider dashed style = {{ margin: '1px 0' }}/>
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
        owner: state.owner,
    }),
    dispatch => ({
    })
  )(Dashboard);




