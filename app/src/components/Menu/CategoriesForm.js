import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}

class CategoriesForm extends Component {

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
            if (this.props.type === '1') {
              const url = `${this.props.optionapp[0].serverUrl}/EditCategories.php`; // изменяем категорию
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  idCategories: this.props.param.idCategories,
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow ? "1" : "0",
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                  chMainImage: this.props.param.chMainImage,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                if (responseJsonFromServer.status) {
                  val = {
                    dataload: { 
                      key: this.props.param.idCategories,
                      idCategories: this.props.param.idCategories,
                      chName: values.chName,
                      chNamePrint: values.chNamePrint,
                      enShow: values.enShow ? "true" : "false",
                      chMainImage: responseJsonFromServer.tmpFileName,
                    }
                  }

                  this.props.onEdit(val);  // вызываем action
                  message.success('Категория изменена');
                  
                  this.props.form.setFieldsValue({
                    'enShow': values.enShow.toString() === "true",
                    'chName': values.chName,
                    'chNamePrint': values.chNamePrint,
                  });
                }
              }).catch((error) => {
                  console.error(error);
              });

            } else {

              const url = `${this.props.optionapp[0].serverUrl}/InsertCategories.php`; // добавляем категорию

              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
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

    delete = () => {
      const url = `${this.props.optionapp[0].serverUrl}/DeleteCategories.php`; // удаление
      fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(
            {
              idCategories: this.props.param.idCategories,
              tmpFileName: this.state.fileList.length ? this.state.fileList[0].name : "",
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
            var val = {
                idCategories: this.props.param.idCategories,
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
          if (nextProps.type === "0") {
            this.props.form.setFieldsValue({
              'enShow': true,
              'chName': '',
              'chNamePrint': '',
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
        const url = this.props.optionapp[0].serverUrl + "/DeleteTmpFile.php"; // удаление
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
        const tmpFilePath = this.props.optionapp[0].serverUrl +  "/UploadFile.php?fName=" + tmpFileName;

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
               <h4>Удалить категорию</h4>
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
                rules: [{ required: true, message: 'Введите имя категории' }],
                initialValue: this.props.type !== "0" ? this.props.param.chName + `${this.props.type === "2" ? " - Копия" : "" }` : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Имя категории" maxLength="100"/>
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
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" maxLength="100"/>
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

const WrappedNormalLoginForm = Form.create()(CategoriesForm);

export default connect (
  state => ({
      categories: state.categories,
      optionapp: state.optionapp,
      owner: state.owner,
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
