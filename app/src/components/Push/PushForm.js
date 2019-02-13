import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}


class CategoriesForm extends React.Component {

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
  

    }

    
    componentWillUnmount () {
     
    }





    render() {
        
      
      const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList, tmpFileName } = this.state;
        const labelColSpan = 8;
        return (
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
            <FormItem
              label="Заголовок"
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chTitlePush', {
                rules: [{ required: true, message: 'Введите заголовок Push-уведомления' }],
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Заголовок Push-уведомления" />
              )}
            </FormItem>
            <FormItem
              label="Текст уведомления"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chTextPush', {
                 rules: [{ required: true, message: 'Введите текст Push-уведомления' }],
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Текст Push-уведомления" />
              )}
            </FormItem>
            <FormItem
            >
              <Button type="primary" htmlType="submit">
                <Icon type="plus"/>Отправить
              </Button>
            </FormItem>
          </Form>
        </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(CategoriesForm);

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
