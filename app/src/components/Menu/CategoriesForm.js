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
        previewVisible: false,
        previewImage: '',
        fileList: [/*{
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }*/],
      };
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
            if (this.props.param) {

              val = {
                dataload: { 
                  key: this.props.param,
                  idCategories: this.props.param,
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow ? "1" : "0",
                }
              }
              this.props.onEditCategory(val);  // вызываем action
              message.success('Категория изменена');
              this.props.form.resetFields(); // ресет полей
              

            } else {
              
              val = {
                dataload: { 
                  key: generateKey(),
                  idCategories: generateKey(),
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow ? "1" : "0",
                }
              }
              this.props.onAddCategory(val);  // вызываем action
              message.success('Категория создана'); 
              this.props.form.resetFields(); // ресет полей
            }
          }
        });
      }

    DeleteCategory = () => {
      var val = {
          idCategories: this.props.param,
      }
      this.props.onDeleteCategory(val);  // вызываем action
      this.props.handler();
      message.success('Категория удалена'); 
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        const labelColSpan = 8;
        //console.log(this.props.categories.find(x => x.idCategories ===  this.props.param).chName);
        
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Загрузить</div>
          </div>
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
              label="Активность"
            >
              {getFieldDecorator('enShow', { 
                initialValue: this.props.param ? (this.props.categories.find(x => x.idCategories ===  this.props.param).enShow === "1" ? true : false ) : true,
                valuePropName: 'checked',
              })(
                <Switch />
              )}
            </FormItem>
            <FormItem
              label="Имя"
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите имя категории' }],
                initialValue: this.props.param ? this.props.categories.find(x => x.idCategories ===  this.props.param).chName : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Имя категории" />
              )}
            </FormItem>
            <FormItem
              label="Отображаемое имя"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chNamePrint', {
                rules: [{ }],
                initialValue: this.props.param ? this.props.categories.find(x => x.idCategories ===  this.props.param).chNamePrint : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" />
              )}
            </FormItem>
            <FormItem
              label="Изображение"
            >
              <div className="dropbox">
                {getFieldDecorator('dragger', {
                  /*valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,*/
                })(
                  <div>
                  <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                  </div>
                )}
              </div>
            </FormItem>
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

const WrappedNormalLoginForm = Form.create()(CategoriesForm);

export default connect (
  state => ({
      categories: state.categories,
  }),
  dispatch => ({
    onAddCategory: (categoryData) => {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData});
    },
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },
    onDeleteCategory: (categoryData) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryData});
    },
  })
)(WrappedNormalLoginForm);
