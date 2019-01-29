import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, message, Switch, Table} from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}

const arrAccess = [
    { keyName: "dashboard",  name: 'Рабочий стол',             value: false},
    { keyName: "orders",  name: 'Заказы',                   value: false},
    { keyName: "customers",  name: 'Клиенты',                  value: true},
    { keyName: "locations",  name: 'Рестораны',                value: false},
    { keyName: "menus",  name: 'Меню - Меню',              value: false},
    { keyName: "categories",  name: 'Меню - Категории',         value: true},
    { keyName: "dishes",  name: 'Меню - Товары',            value: false},
    { keyName: "option-sets",  name: 'Меню - Наборы',            value: false},
    { keyName: "sorting",  name: 'Меню - Сортировка',        value: true},
    { keyName: "staff", name: 'Сотрудники',               value: false},
    { keyName: "stock", name: 'Акции',                    value: false},
    { keyName: "general-settings", name: 'Настройки - Общие',        value: true},
    { keyName: "type-order", name: 'Настройки - Типы заказов', value: true},
    { keyName: "times", name: 'Настройки - Время',        value: true},
    { keyName: "150", name: 'Настройки - Оплата',       value: true},
    { keyName: "160", name: 'Настройки - Оформление',   value: true},
    { keyName: "170", name: 'Настройки - Правила',      value: true},
    { keyName: "180", name: 'Оплата',                   value: false},
  ];
  
class StaffForm extends React.Component {

    constructor(props) {
      super(props);
    
      this.state = {
        
      };
    }

    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            
            var val = {};
            var obj = {};
            arrAccess.map( item => {
                const newarr = {};
                newarr[item.keyName] = values[item.keyName];
                obj[item.keyName]= values[item.keyName];
            })

            val = {
                chName: values.chName,
                chPassword: values.chPassword,
                arrAccess: obj,
              }

            
              console.log(values);
            console.log(val);

            
              /*
            var val = {};
            if (this.props.param) {
              
              const url = this.props.optionapp[0].serverUrl + "/EditCategories.php"; // изменяем категорию

              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  idCategories: this.props.param,
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow ? "1" : "0",
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: this.props.param,
                    idCategories: this.props.param,
                    chName: values.chName,
                    chNamePrint: values.chNamePrint,
                    enShow: values.enShow ? "true" : "false",
                    chMainImage:responseJsonFromServer, 
                  }
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Категория изменена');
                this.props.form.resetFields(); // ресет полей
              }).catch((error) => {
                  console.error(error);
              });

            } else {

              const url = this.props.optionapp[0].serverUrl + "/InsertCategories.php"; // добавляем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow ? "1" : "0",
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: responseJsonFromServer.id.toString(),
                    idCategories: responseJsonFromServer.id.toString(),
                    chName: values.chName,
                    chNamePrint: values.chNamePrint,
                    enShow: values.enShow ? "true" : "false",
                    chMainImage: responseJsonFromServer.tmpFileName, 
                  }
                }

                this.props.onAdd(val);  // вызываем action
                message.success('Категория создана'); 
                this.props.form.resetFields(); // ресет полей
                this.setState({
                  tmpFileName: generateKey(),
                  fileList: [],
                })

                this.props.form.setFieldsValue({
                  'enShow': true,
                  'chName': "",
                  'chNamePrint': "",
                });


              }).catch((error) => {
                  console.error(error);
              });
            }
            */
          }
        });
      }

    DeleteCategory = () => {
      const url = this.props.optionapp[0].serverUrl + "/DeleteCategories.php"; // удаление
      //console.log(this.state.fileList[0].serverUrl);
      
      
      fetch(url,
        {
            method: 'POST',
            headers: 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
              idCategories: this.props.param,
              tmpFileName: this.state.fileList.length ? this.state.fileList[0].name : "",
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
            var val = {
                idCategories: this.props.param,
            }
            this.props.onDelete(val);  // вызываем action
        }).catch((error) =>
        {
            console.error(error);
        });
        message.success('Категория удалена'); 
        this.props.handler();
        
    }

    componentWillReceiveProps(nextProps) {
      
      if(nextProps.param !== this.props.param) {
        this.DeleteTmpFile(); // удаляем временный файл
        
        this.props.form.setFieldsValue({
          'chName': this.props.categories.find(x => x.idCategories ===  nextProps.param).chName,
          'chNamePrint': this.props.categories.find(x => x.idCategories ===  nextProps.param).chNamePrint,
        });

      }
    }

  

    render() {
        const { getFieldDecorator } = this.props.form;
        const { dataSource } = this.state;
        const labelColSpan = 8;

        const AccessPages = arrAccess.map( (item, index) => 
            <FormItem
                style={{ marginBottom: 2, paddingBottom: 0 }}
                key = {index}
            >
              {getFieldDecorator(item.keyName, { 
                initialValue: item.value,
                valuePropName: 'checked'
              })(
                <Switch size="small"/>
              )} {item.name}
            </FormItem>
        );
 
        return (
          <div>
            { this.props.param ? (       
            <div style={{ 
              margin: "15px 0", 
              padding: "15px 0", 
              borderTopStyle: "dashed", 
              borderTopWidth: "1px", 
              borderTopColor: "#cecece",
              borderBottomStyle: "dashed", 
              borderBottomWidth: "1px", 
              borderBottomColor: "#cecece",
               }}>
               <h4>Удалить категорию</h4>
               <Popconfirm title="Удалить категорию?" onConfirm={() => this.DeleteCategory()} okText="Да" cancelText="Нет">
                  <Button type="primary">
                    Удалить
                  </Button>
                </Popconfirm>
            </div>) : null
            }
            <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
            <FormItem
              label="Имя пользователя"
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите имя пользователя' }],
                initialValue: this.props.param ? this.props.categories.find(x => x.idCategories ===  this.props.param).chName : 
                  this.props.copyrecord.length !== 0 ? this.props.copyrecord.chName + " - Копия" : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Имя пользователя" />
              )}
            </FormItem>
            <FormItem
              label="Пароль"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chPassword', {
                rules: [{ }],
                initialValue: ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Пароль" />
              )}
            </FormItem>
            <div style={{ marginBottom: 20 }}>
                <span style={{ lineHeight: 2, fontWeight: 500 }}>Доступ к разделам</span>
              {AccessPages}
            </div>
           
            <FormItem
            >
              <Button type="primary" htmlType="submit">
                <Icon type="plus"/>Сохранить
              </Button>
            </FormItem>
          </Form>
        </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(StaffForm);

export default connect (
  state => ({
      categories: state.categories,
      optionapp: state.optionapp,
  }),
  dispatch => ({
    onAdd: (categoryData) => {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData});
    },
    onEdit: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },
    
    onDelete: (categoryData) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryData});
    },
  })
)(WrappedNormalLoginForm);
