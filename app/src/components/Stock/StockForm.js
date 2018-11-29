import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}


class StockForm extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        previewVisible: false,
        previewImage: '',
        tmpFileName: generateKey(),
        fileList: this.props.param ? this.props.stock.find(x => x.idStock ===  this.props.param).chMainImage.length ? [{
          uid: '-1',
          name: this.props.stock.find(x => x.idStock ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
          status: 'done',
          url: this.props.stock.find(x => x.idStock ===  this.props.param).chMainImage,
          
        }] : [] : [],
      };
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }

    handleChange = ({ fileList }) => {
      this.setState({ fileList })
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
      
      if(nextProps.param !== this.props.param) {
        this.DeleteTmpFile(); // удаляем временный файл
        
        this.props.form.setFieldsValue({
          'enShow': this.props.stock.find(x => x.idStock ===  nextProps.param).enShow === "true",
          'chName': this.props.stock.find(x => x.idStock ===  nextProps.param).chName,
          'chNamePrint': this.props.stock.find(x => x.idStock ===  nextProps.param).chNamePrint,
        });
        this.setState({
          tmpFileName: generateKey(),
          fileList: this.props.stock.find(x => x.idStock ===  nextProps.param).chMainImage.length ? [{
            uid: '-1',
            name: this.props.stock.find(x => x.idStock ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
            status: 'done',
            url: this.props.stock.find(x => x.idStock ===  nextProps.param).chMainImage,
        }] : [] });
      }
    }

    
    componentWillUnmount () {
      this.DeleteTmpFile();
    }

    DeleteTmpFile = () => {
      const url = this.props.optionapp[0].serverUrl + "/DeleteTmpFile.php"; // удаление
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
              tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
          //console.log(responseJsonFromServer);
        }).catch((error) =>
        {
          //console.error(error);
        });
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList, tmpFileName } = this.state;
        const labelColSpan = 8;
        const tmpFilePath = this.props.optionapp[0].serverUrl +  "/UploadFile.php?fName=" + tmpFileName;

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
                initialValue: this.props.param  ? (this.props.stock.find(x => x.idStock ===  this.props.param).enShow === "true" ) : true,
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
                initialValue: this.props.param ? this.props.stock.find(x => x.idStock ===  this.props.param).chName : 
                  this.props.copyrecord.length !== 0 ? this.props.copyrecord.chName + " - Копия" : ""
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
                initialValue: this.props.param ? this.props.stock.find(x => x.idStock ===  this.props.param).chNamePrint :  
                  this.props.copyrecord.length !== 0 ? this.props.copyrecord.chNamePrint : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" />
              )}
            </FormItem>
            <FormItem
              label="Описание"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('sDescription', {
                rules: [{ }],
                initialValue: this.props.param ? this.props.stock.find(x => x.idStock ===  this.props.param).sDescription :  
                  this.props.copyrecord.length !== 0 ? this.props.copyrecord.sDescription : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Описание" />
              )}
            </FormItem>
            <FormItem
              label="Дополнительное описание"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chNotes', {
                rules: [{ }],
                initialValue: this.props.param ? this.props.stock.find(x => x.idStock ===  this.props.param).chNotes :  
                  this.props.copyrecord.length !== 0 ? this.props.copyrecord.chNotes : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Дополнительное описание" />
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
                    action={tmpFilePath}
                    listType="picture-card"
                    enctype="multipart/form-data"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="" style={{ width: '100%' }} src={previewImage} />
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

const WrappedNormalLoginForm = Form.create()(StockForm);

export default connect (
  state => ({
      stock: state.stock,
      optionapp: state.optionapp,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_STOCK', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_STOCK', payload: data});
    },
    
    onDelete: (data) => {
      dispatch({ type: 'DELETE_STOCK', payload: data});
    },
  })
)(WrappedNormalLoginForm);
