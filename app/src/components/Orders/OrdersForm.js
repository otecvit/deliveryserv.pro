import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, Radio, Select, message, Tabs, Cascader, DatePicker  } from 'antd';
import { Row, Col } from 'antd';
import moment from 'moment';

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
        };
      }

    onChangeStatus = (e) => {
        this.props.onCreate(e); 
        this.setState({currentStatus: "status-" + e});
        message.success("Статус заказа изменен");
    }

    
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { currentStatus } = this.state;
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
                        initialValue: this.props.param ? this.props.param.iStatus : "1"
                    })(
                    <Select 
                        placeholder="Выберите статус" 
                        style={{ width: "100%" }}
                        onChange={this.onChangeStatus}
                    >
                        <Option key="0" value="0">Не подтвержден</Option>
                        <Option key="1" value="1">Подтвержден</Option>
                        <Option key="2" value="2">Приготовлен</Option>
                        <Option key="3" value="3">В пути</Option>
                        <Option key="4" value="4">Выполнен</Option>
                        <Option key="5" value="5">Отменен</Option>

                    </Select>
                    )}
                    </FormItem>
 
          <Tabs defaultActiveKey="1">
            <TabPane tab="Подробности" key="1">
              <div className="d-table">
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Статус</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Номер заказа</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Дата заказа</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Время доставки</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Способ оплаты</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Подтверждение</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Адрес доставки</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Комментарий</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Клиент" key="2">
              <div className="d-table">
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Имя</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Номер телефона</div>
                  <div className="d-td content-modal-orders">lorem</div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Заказ" key="3">

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
        var val = {
              idOrder: this.props.param.idOrder,
              iStatus: e, 
          };

        this.props.onEditStatus(val);

        /*
          const proxyurl = "https://cors-anywhere.herokuapp.com/";
          const url = "http://mircoffee.by/mirprokata_app/api/EditClient.php"; // клиенты

          fetch(proxyurl + url,
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  idClient: this.props.param.record.idClient,
                  chFIO : values.chFIO,
                  iStatus: values.iStatus, 
                  chRegistration: values.chRegistration, 
                  chLocation: values.chLocation, 
                  chPhoneOne: values.chPhoneOne, 
                  chPhoneSecond: values.chPhoneSecond, 
                  chDocument: values.chDocument, 
                  chPassport: values.chPassport, 
                  chIssued: values.chIssued,
                  chID: values.chID,
                  dIssue: values.dIssue, 
                  dValidity: values.dValidity, 
                  dBirthDay: values.dBirthDay,
                  chEmail: values.chEmail,
                  chComment: values.chComment
                })
 
            }).then((response) => response.json()).then((responseJsonFromServer) =>
            {

              var d = new Date(values.dIssue);
              var d1 = new Date(values.dValidity);
              var d2 = new Date(values.dBirthDay);

              val = {
                key: this.props.param.record.idClient, 
                dataload: { 
                  idClient: this.props.param.record.idClient,
                  chFIO: values.chFIO, 
                  iStatus: values.iStatus, 
                  chStatus: this.getStatus(values.iStatus),
                  chRegistration: values.chRegistration, 
                  chLocation: values.chLocation, 
                  chPhoneOne: values.chPhoneOne, 
                  chPhoneSecond: values.chPhoneSecond, 
                  chDocument: values.chDocument, 
                  chPassport: values.chPassport, 
                  chIssued: values.chIssued,
                  chID: values.chID,
                  dIssue: ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth()+1)).slice(-2) + '.' +  d.getFullYear(), 
                  dValidity: ('0' + d1.getDate()).slice(-2) + '.' + ('0' + (d1.getMonth()+1)).slice(-2) + '.' +  d1.getFullYear(), 
                  dBirthDay: ('0' + d2.getDate()).slice(-2) + '.' + ('0' + (d2.getMonth()+1)).slice(-2) + '.' +  d2.getFullYear(),
                  chEmail: values.chEmail,
                  chComment: values.chComment
                }
              };
              this.props.onEditClient(val);
              message.success('Клиент изменен успешно');

            }).catch((error) =>
            {
                console.error(error);
            });
            */
        //form.resetFields();
        //this.setState({ visible: false });
        //this.props.handler();

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
    orders: state.orders
  }),
  dispatch => ({
    onEditStatus: (data) => {
        dispatch({ type: 'EDIT_ORDERS_STATUS', payload: data});
      },
  })
)(OrdersForm);
