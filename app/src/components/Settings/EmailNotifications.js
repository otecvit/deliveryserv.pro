import React, { Component } from 'react'
import { Form, Icon, Input, Button, Tag, message, Switch, Layout, Select } from 'antd';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class EmailNotifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailList: this.props.owner.chListEmailNotification.length ? this.props.owner.chListEmailNotification.map((item) => item) : [],
            inputVisible: false,
            inputValue: '',
            blNewOrderNotification: this.props.owner.blNewOrderNotification === "true",
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
              var val = {};
              const url = this.props.optionapp[0].serverUrl + "/EditOwnerSettings.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  blPickup: this.props.owner.blPickup ? "1" : "0",
                  blDelivery: this.props.owner.blDelivery ? "1" : "0",
                  blCashCourier: this.state.blCashCourier ? "1" : "0",
                  blCardCourier: this.state.blCardCourier ? "1" : "0",
                  blCashPickup: this.state.blCashPickup ? "1" : "0",
                  blCardPickup: this.state.blCardPickup ? "1" : "0",
                  blNewOrderNotification: this.state.blNewOrderNotification ? "1" : "0",
                  chListEmailNotification: this.state.emailList
                 })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  idCustomer: this.props.owner.idCustomer,
                  blNewOrderNotification: values.blNewOrderNotification.toString(),
                  chListEmailNotification: this.state.emailList
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Настройки сохранены');
              }).catch((error) => {
                  console.error(error);
              });
              
          }
        });
      }

      onChangeNotification = (checked) => {
        this.setState({
          blNewOrderNotification: checked,
        })
      }


    handleClose = (removedTag) => {
      const emailList = this.state.emailList.filter(tag => tag !== removedTag);
      this.setState({ emailList });
    }
  
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }
  
    handleInputChange = (e) => {
      this.setState({ inputValue: e.target.value });
    }
  
    handleInputConfirm = () => {
      const state = this.state;
      const inputValue = state.inputValue;
      let emailList = state.emailList;

      

      if (inputValue && emailList.indexOf(inputValue) === -1 && this.ValidateCorrectEmail(inputValue) && this.ValidateCountEmail(emailList.length)) {
        emailList = [...emailList, inputValue];
      }
      this.setState({
        emailList,
        inputVisible: false,
        inputValue: '',
      });
    }

    ValidateCorrectEmail = (email) => {
      if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        return true;
      } else {
        message.error("Некорректный формат E-mail");
        return false;
      }
    }

    ValidateCountEmail = (count) => {
      const CountEmail = 3;
      if (count < CountEmail) {
        return true;
      } else {
        message.error("Не более трех почтовых ящиков");
        return false;
      }
    }

    saveInputRef = input => this.input = input

    render() {
        const { emailList, inputVisible, inputValue } = this.state;

        const { getFieldDecorator } = this.props.form;
        
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });
        
        return (<div>
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><IconFont type="icon-orders" style={{ fontSize: '16px', marginRight: "10px"}}/>E-mail уведомления</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                  <FormItem
                        label="Список E-mail (не более трех почтовых адресов)"
                    >
                    {emailList.map((tag, index) => {
                      return (
                        <Tag 
                          key={tag} 
                          closable 
                          afterClose={() => this.handleClose(tag)}
                          className = "email-list"
                        >
                          {tag}
                        </Tag>
                      );
                    })}
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 150 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        className = "email-list"
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" /> Добавить e-mail
                      </Tag>
                    )}
                  </FormItem>

                    <FormItem
                        label="Уведомление о новом заказе"
                        >
                        {getFieldDecorator('blNewOrderNotification', { 
                            initialValue: this.props.owner.blNewOrderNotification === "true",
                            valuePropName: 'checked'
                        })(
                            <Switch onChange={this.onChangeNotification}/>
                        )}
                    </FormItem>
                    <FormItem>
                    <Button type="primary" htmlType="submit">
                        <Icon type="plus"/>Сохранить
                    </Button>
                    </FormItem>
                </Form>                                    
                </div>
            </Content>          
        </div>)
    }
}

const WrappedNormalForm = Form.create()(EmailNotifications);

export default connect (
  state => ({
      optionapp: state.optionapp,
      owner: state.owner,
  }),
  dispatch => ({
    onEdit: (data) => {
      dispatch({ type: 'EDIT_OWNER', payload: data});
    },
  })
)(WrappedNormalForm);