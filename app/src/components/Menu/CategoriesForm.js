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
        fileList: this.props.param ? [{
          uid: '-1',
          name: this.props.categories.find(x => x.idCategories ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
          status: 'done',
          url: this.props.categories.find(x => x.idCategories ===  this.props.param).chMainImage,
        }] : [],
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
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: this.props.param,
                    idCategories: this.props.param,
                    chName: values.chName,
                    chNamePrint: values.chNamePrint,
                    enShow: values.enShow ? "true" : "false",
                  }
                }

                console.log(values.chMainImage);
                

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
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: responseJsonFromServer.toString(),
                    idCategories: responseJsonFromServer.toString(),
                    chName: values.chName,
                    chNamePrint: values.chNamePrint,
                    enShow: values.enShow ? "true" : "false",
                  }
                }
                this.props.onAdd(val);  // вызываем action
                message.success('Категория создана'); 
                this.props.form.resetFields(); // ресет полей
              }).catch((error) => {
                  console.error(error);
              });
            }
          }
        });
      }

    DeleteCategory = () => {
      const url = this.props.optionapp[0].serverUrl + "/DeleteCategories.php"; // удаление
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
              idCategories: this.props.param
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
        this.props.form.setFieldsValue({
          'enShow': this.props.categories.find(x => x.idCategories ===  nextProps.param).enShow === "true",
        });
        this.setState({
        fileList: [{
          uid: '-1',
          name: this.props.categories.find(x => x.idCategories ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
          status: 'done',
          url: this.props.categories.find(x => x.idCategories ===  nextProps.param).chMainImage,
        }]});
      }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        const labelColSpan = 8;

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
                initialValue: this.props.param  ? (this.props.categories.find(x => x.idCategories ===  this.props.param).enShow === "true" ) : true,
                valuePropName: 'checked'
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
                {getFieldDecorator('chMainImage', {
                  /*valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,*/
                })(
                  <div>
                  <Upload
                    /*action="http://mircoffee.by/deliveryserv/app/api/admin/UploadFile.php"*/
                    listType="picture-card"
                    enctype="multipart/form-data"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    customRequest={(info) => {
                      console.log(info.file);
                      const uploadUrl = "http://mircoffee.by/deliveryserv/app/api/admin/UploadFile.php";     
                      
                      fetch( uploadUrl, { // Your POST endpoint
                      method: 'POST',
                      headers: {
                        "Content-Type": "You will perhaps need to define a content-type here"
                      },
                      body: info.file // This is your file object
                      }).then(
                        response => response.json() // if the response is a JSON object
                      ).then(
                        success => console.log(success) // Handle the success response object
                      ).catch(
                        error => console.log(error) // Handle the error response object
                      );
                              
                        /*         
                      let xhr = new XMLHttpRequest();
                      //if (!uploadUrl) { return; }
                      if (info.onProgress && xhr.upload) {
                        xhr.upload.onprogress = function progress(e) {
                          if (e.total > 0) {
                            e.percent = e.loaded / e.total * 100;
                          }
                          info.onProgress(e);
                        }
                      }
                      xhr.open('PUT', uploadUrl, true);
                      xhr.overrideMimeType(info.file.type)
                      xhr.send(info.file);
                      xhr.addEventListener('loadend', (e) => {
                        info.onSuccess(e, xhr);
                        console.log("+");
                        
                      })
                      */
                    }}
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
