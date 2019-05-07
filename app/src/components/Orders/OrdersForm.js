import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, Radio, Select, message, Tabs, Table, DatePicker  } from 'antd';
import { Row, Col } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TextArea } = Input;

function handleChange(value) {
  console.log(`selected ${value}`);
}

const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}


function onChange(value) {
  console.log(value);
}

// Just show the latest item.
function displayRender(label) {
  return label[label.length - 1];
}

const CollectionCreateForm = Form.create()(
  class extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
          currentStatus: this.props.param ? "status-" + this.props.param.iStatus : "status-0",
          chStatusName: this.getStatusName(this.props.param.iStatus),
          dataSource: [],
        };
      }

    onChangeStatus = (e) => {
        this.props.onCreate(e); 
        this.setState({
          currentStatus: "status-" + e,
          chStatusName: this.getStatusName(e),
        });
        message.success("Статус заказа изменен");
    }

  getStatusName = (e) => {
    switch (e) {
      case "1": return "Не подтвержден"; // не подтвержден 
      case "2": return "Подтвержден"; // подтвердил
      case "3": return "Приготовлен";  // готов
      case "4": return "В пути"; // в пути
      case "5": return "Выполнен"; // выполнен
      case "6": return "Отменен"; // отменен
   };
  }

    componentDidMount() {
      
      
      if (!Number(this.props.param.iStatus)) {
        const url = this.props.optionapp[0].serverUrl + "/EditStatusOrder.php"; // изменяем категорию
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(
          {
            idOrder: this.props.param.idOrder,
            iStatus: "1", 
          })
        }).then((response) => response.json()).then((responseJsonFromServer) => {
          this.props.onCreate("1"); 
        }).catch((error) => {
            console.error(error);
        });
        this.setState({
          currentStatus: "status-1",
          chStatusName: this.getStatusName("1"),
        });


      }
      
      
      const url = this.props.optionapp[0].serverUrl + "/SelectOrdersDetail.php";

      fetch(url, 
        {
            method: 'POST',
            body: JSON.stringify(
            {
              idOrder: this.props.param.idOrder
           })
        })
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({
            dataSource: responseJson.ordersdetail,
          })
      })
      .catch((error) => {
        console.error(error);
      });
      
      
  }

    
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { currentStatus, chStatusName, dataSource } = this.state;
      const { getFieldDecorator } = form;
      const labelColSpan = 8;
      const wrapperColSpan = 16;
      const dateFormat = 'DD.MM.YYYY';
       
      return (
        <Modal
          visible={visible}
          title = {this.props.param ? `Заказ #${this.props.param.chNameOrder}` : null}
          onCancel={onCancel}
          width ={500}
          footer={null}
          wrapClassName={currentStatus}
          centered
        >
        
            <Form layout="horizontal">
                    <FormItem
                    labelCol={{ span: labelColSpan }}
                    style={{ marginBottom: "10", width: "100%" }}
                    >
                    {getFieldDecorator('iStatus', {
                        initialValue: Number(this.props.param.iStatus) ? this.props.param.iStatus : "1"
                    })(
                    <Select 
                        placeholder="Выберите статус" 
                        style={{ width: "100%" }}
                        onChange={this.onChangeStatus}
                    >
                        <Option key="1" value="1">Не подтвержден</Option>
                        <Option key="2" value="2">Подтвержден</Option>
                        <Option key="3" value="3">Приготовлен</Option>
                        <Option key="4" value="4">В пути</Option>
                        <Option key="5" value="5">Выполнен</Option>
                        <Option key="6" value="6">Отменен</Option>

                    </Select>
                    )}
                    </FormItem>
 
          <Tabs defaultActiveKey="1">
            

            <TabPane tab="Подробности" key="1">
              <div className="d-table">
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Статус</div>
                  <div className="d-td content-modal-orders">{chStatusName}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Номер заказа</div>
                  <div className="d-td content-modal-orders">{this.props.param.idOrder}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Дата заказа</div>
                  <div className="d-td content-modal-orders">{this.props.param.chPlaced}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Время доставки</div>
                  <div className="d-td content-modal-orders">{this.props.param.chDue}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Способ оплаты</div>
                  <div className="d-td content-modal-orders">{this.props.param.chPaymentMethod}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Подтверждение</div>
                  <div className="d-td content-modal-orders">{this.props.param.chMethodConfirmation}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Адрес доставки</div>
                  <div className="d-td content-modal-orders">{this.props.param.chAddress}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Комментарий</div>
                  <div className="d-td content-modal-orders">{this.props.param.chComment}</div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Клиент" key="2">
              <div className="d-table">
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Имя</div>
                  <div className="d-td content-modal-orders">{this.props.param.chNameClient}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Номер телефона</div>
                  <div className="d-td content-modal-orders">{this.props.param.chPhone}</div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Заказ" key="3">
              <div className="d-table">
                <Row className="header-order-details">
                  <Col span={2}>№</Col>
                  <Col span={18}>Товар</Col>
                  <Col span={4} style={{textAlign: "right"}}>Цена</Col>
                </Row>
                {dataSource.map( (item, index) => {
                  return (
                    <div key={index}>
                      <Row className="order-details-content">
                        <Col span={2}>{index + 1}</Col>
                        <Col span={18}>
                          {item.chNameProduct}
                          {item.arrOption.length ? 
                            <ul className="no-bottom">
                              {item.arrOption.map( d => <li key={d.key}>{d.chOption}</li>)}
                            </ul> : null}
                        </Col>
                        <Col span={4} style={{textAlign: "right"}}>
                          {Number(item.chPriceProduct).toFixed(2)}
                          {item.arrOption.length ? 
                            <div>
                              {item.arrOption.map( d => <div key={d.key}>+{Number(d.chChangePrice).toFixed(2)}</div>)}
                            </div> : null}
                        </Col>
                      </Row>
                      <Row className="order-details-subtotal">
                        <Col span={2}></Col>
                        <Col span={18}>Итого за товар</Col>
                        <Col span={4} style={{textAlign: "right"}}>{item.arrOption.length ? Number(item.arrOption.map( d => Number(d.chChangePrice)).reduce((a, b) => a + b, Number(item.chPriceProduct))).toFixed(2) : Number(item.chPriceProduct).toFixed(2)}</Col>
                      </Row>
                    </div>
                  );
                })}
                <Row className="header-order-total">
                  <Col span={2}></Col>
                  <Col span={18}>Итого сумма заказа, {this.props.owner.chCurrency}</Col>
                  <Col span={4} style={{textAlign: "right"}}>{Number(this.props.param.chOrderPrice).toFixed(2)}</Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>
          </Form>
        </Modal>
      );
    }
  }
);


class OrdersForm extends Component {
    state = {
      visible: true,
    };


    handleCreate = (e) => {
      const form = this.formRef.props.form;
   
      form.validateFields((err, values) => {
        if (err) {
          return;
        }

        const url = this.props.optionapp[0].serverUrl + "/EditStatusOrder.php"; // изменяем категорию
        fetch(url, {
          method: 'POST',
          headers: 
          {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            idOrder: this.props.param.idOrder,
            iStatus: e, 
          })
        }).then((response) => response.json()).then((responseJsonFromServer) => {
          
          var val = {
            idOrder: this.props.param.idOrder,
            iStatus: e, 
          }
          this.props.onEditStatus(val);

        }).catch((error) => {
            console.error(error);
        });


      

      });
    }

    saveFormRef = (formRef) => {
      this.formRef = formRef;
    }

    render() {
        return (
            <div>
                    <CollectionCreateForm
                      orders = {this.props.orders}
                      optionapp = {this.props.optionapp}
                      owner = {this.props.owner}
                      wrappedComponentRef={this.saveFormRef}
                      visible={this.state.visible}
                      onCancel={this.props.handler} //вызываем функцию родительского компонента
                      onCreate={this.handleCreate}
                      param={this.props.param}
                    />
            </div>
        );
    };
}

export default connect (
  state => ({
    orders: state.orders,
    optionapp: state.optionapp,
    owner: state.owner,
  }),
  dispatch => ({
    onEditStatus: (data) => {
        dispatch({ type: 'EDIT_ORDERS_STATUS', payload: data});
      },
  })
)(OrdersForm);
