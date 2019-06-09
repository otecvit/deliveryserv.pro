import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}


class StockForm extends React.Component {

    state = {
        previewVisible: false,
        previewImage: '',
        tmpFileName: generateKey(),
        fileList: this.props.type === "1" ? this.props.param.chMainImage.length ? [{
          uid: '-1',
          name: this.props.param.chMainImage.replace(/^.*(\\|\/|\:)/, ''),
          status: 'done',
          url: this.props.param.chMainImage,
        }] : [] : [],
      };
    

    // закрываем окно просмотра изображения
    handleCancel = () => this.setState({ previewVisible: false })

    // просмотр изображения
    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }

    // добавляем картинку
    handleChange = ({ fileList }) => {
      this.setState({ fileList })
    }

    // сохраняем акцию
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
            if (this.props.type === '1') {
              const url = `${this.props.optionapp[0].serverUrl}/EditStock.php`; // изменяем акцию
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  idStock: this.props.param.idStock,
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  sDescription: values.sDescription,
	                chNotes: values.chNotes,
                  enShow: values.enShow ? "1" : "0",
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                  chMainImage: this.props.param.chMainImage,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                if (responseJsonFromServer.status) {
                    val = {
                      dataload: { 
                        key: this.props.param.idStock,
                        idStock: this.props.param.idStock,
                        chName: values.chName,
                        chNamePrint: values.chNamePrint,
                        sDescription: values.sDescription,
                        chNotes: values.chNotes,
                        enShow: values.enShow ? "true" : "false",
                        chMainImage: responseJsonFromServer.tmpFileName, 
                      }
                    }
                    this.props.onEdit(val);  // вызываем action
                    message.success('Акция изменена');

                    this.props.form.setFieldsValue({
                      'enShow': values.enShow.toString() === "true",
                      'chName': values.chName,
                      'chNamePrint': values.chNamePrint,
                      'sDescription': values.sDescription,
                      'chNotes': values.chNotes,
                    });
                  }
              }).catch((error) => {
                  console.error(error);
              });

            } else {

              const url = `${this.props.optionapp[0].serverUrl}/InsertStock.php`; // добавляем акцию
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  sDescription: values.sDescription,
                  chNotes: values.chNotes,
                  enShow: values.enShow ? "1" : "0",
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: responseJsonFromServer.id.toString(),
                    idStock: responseJsonFromServer.id.toString(),
                    chName: values.chName,
                    chNamePrint: values.chNamePrint,
                    sDescription: values.sDescription,
                    chNotes: values.chNotes,
                    enShow: values.enShow ? "true" : "false",
                    chMainImage: responseJsonFromServer.tmpFileName, 
                  }
                }

                this.props.onAdd(val);  // вызываем action
                message.success('Акция создана'); 
                this.props.form.resetFields(); // ресет полей
                this.setState({
                  tmpFileName: generateKey(),
                  fileList: [],
                })

                this.props.form.setFieldsValue({
                  'enShow': true,
                  'chName': "",
                  'chNamePrint': "",
                  'sDescription': "",
                  'chNotes': "",
                });


              }).catch((error) => {
                  console.error(error);
              });
            }
          }
        });
      }

    delete = () => {
      const url = `${this.props.optionapp[0].serverUrl}/DeleteStock.php`; // удаление
      
      fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(
            {
              idStock: this.props.param.idStock,
              tmpFileName: this.state.fileList.length ? this.state.fileList[0].name : "",
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
            var val = {
              idStock: this.props.param.idStock,
            }
            this.props.onDelete(val);  // вызываем action
        }).catch((error) =>
        {
            console.error(error);
        });
        message.success('Акция удалена'); 
        this.props.handler();
        
    }

    componentWillReceiveProps(nextProps) {

      if(nextProps.param !== this.props.param) {
        this.DeleteTmpFile(); // удаляем временный файл
        if (nextProps.type === "0") {
          this.props.form.setFieldsValue({
            'enShow': true,
            'chName': '',
            'chNamePrint': '',
            'sDescription': "",
            'chNotes': "",

          });
        
          this.setState({
            tmpFileName: generateKey(),
            fileList: [],
          });
        }

        if (nextProps.type === "2" || nextProps.type === "1") {
          this.props.form.setFieldsValue({
            'enShow': nextProps.param.enShow === "true",
            'chName': nextProps.param.chName + `${nextProps.type === "2" ? " - Копия" : "" }`,
            'chNamePrint': nextProps.param.chNamePrint,
            'sDescription': nextProps.param.sDescription,
            'chNotes': nextProps.param.chNotes,
          });

          this.setState({
            tmpFileName: generateKey(),
            fileList: nextProps.param.chMainImage.length && nextProps.type !== "2" ? [{
              uid: '-1',
              name: nextProps.param.chMainImage.replace(/^.*(\\|\/|\:)/, ''),
              status: 'done',
              url: nextProps.param.chMainImage,
              }] : []
          });
        }
      }
    }

    componentWillUnmount () {
      this.DeleteTmpFile();
    }

    DeleteTmpFile = () => {
      if (typeof this.state.fileList[0] !== 'undefined' && typeof this.state.fileList[0].response !== 'undefined') {
        const url = `${this.props.optionapp[0].serverUrl}/DeleteTmpFile.php`; // удаление
        fetch(url,
          {
              method: 'POST',
              body: JSON.stringify(
              {
                tmpFileName: this.state.tmpFileName + this.state.fileList[0].response,
              })
          }).then((response) => response.json()).then((responseJsonFromServer) =>

          {
          }).catch((error) =>
          {
            console.error(error);
          });
        }
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList, tmpFileName } = this.state;
        const labelColSpan = 8;
        const tmpFilePath = `${this.props.optionapp[0].serverUrl}/UploadFile.php?fName=${tmpFileName}`;

        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Загрузить</div>
          </div>
        );

        return (
          <div>
            { this.props.type === "1" ? (       
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
               <h4>Удалить акцию</h4>
               <Popconfirm title="Удалить категорию?" onConfirm={() => this.delete()} okText="Да" cancelText="Нет">
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
                initialValue: this.props.type !== "0"  ? this.props.param.enShow === "true" : true,
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
                rules: [{ required: true, message: 'Введите название акции' }],
                initialValue: this.props.type !== "0" ? this.props.param.chName + `${this.props.type === "2" ? " - Копия" : "" }` : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Название акции" />
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
                initialValue: this.props.type !== "0" ? this.props.param.chNamePrint : ""
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
                initialValue: this.props.type !== "0" ? this.props.param.sDescription : ""
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
                initialValue: this.props.type !== "0" ? this.props.param.chNotes : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Дополнительное описание" />
              )}
            </FormItem>
            <FormItem
              label="Изображение"
            >
              <div className="dropbox">
                {getFieldDecorator('chMainImage', {
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
      owner: state.owner,
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
