import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form } from 'antd';

import { numberWithSpaces } from '../../function/functions'

const CollectionCreateForm = Form.create()(
  class extends React.Component {
   
    render() {
      const { visible, onCancel } = this.props;
       
      return (
        <Modal
          visible={visible}
          title = {this.props.param.chFIO.length ? `${this.props.param.chFIO}` : "Клиент"}
          onCancel={onCancel}
          width ={500}
          footer={null}
          wrapClassName="status-3"
          style={{ top: 50 }}
        >
              <div className="d-table">
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Дата регистрация</div>
                  <div className="d-td content-modal-orders">{this.props.param.dDateRegistration}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Последний вход</div>
                  <div className="d-td content-modal-orders">{this.props.param.dLastSeen}</div>
                </div>
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Регистрация</div>
                  <div className="d-td content-modal-orders">{this.props.param.chUID.length ? "Да" : "Нет"}</div>
                </div>     
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Имя</div>
                  <div className="d-td content-modal-orders">{this.props.param.chFIO}</div>
                </div> 
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Номер телефона</div>
                  <div className="d-td content-modal-orders">{this.props.param.chPhone}</div>
                </div>  
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Сессий</div>
                  <div className="d-td content-modal-orders">{this.props.param.iSession}</div>
                </div>  
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Заказов</div>
                  <div className="d-td content-modal-orders">{this.props.param.countOrder}</div>
                </div>  
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Сумма заказов</div>
                  <div className="d-td content-modal-orders">{numberWithSpaces(Number(this.props.param.sumOrder).toFixed(2))} {this.props.owner.chCurrency}</div>
                </div>  
                <div className="d-tr">
                  <div className="d-td title-modal-orders">Последний заказ</div>
                  <div className="d-td content-modal-orders">{this.props.param.dLastSeen}</div>
                </div>           
              </div>
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
