import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const FormItem = Form.Item;
const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class Customisation extends Component {

    state = {
      previewVisible: false,
      previewImage: '',
      tmpFileName: generateKey(),
      fileList: this.props.owner.chPathLogo.length ? [{
        uid: '-1',
        name: this.props.owner.chPathLogo.replace(/^.*(\\|\/|\:)/, ''),
        status: 'done',
        url: this.props.owner.chPathLogo,
      }] : [],
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
            const url = `${this.props.optionapp[0].serverUrl}/EditCustomisation.php`; // изменяем категорию
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(
              {
                chUID: this.props.owner.chUID,
                tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                chMainImage: this.props.owner.chPathLogo,
              })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
              if (responseJsonFromServer.status) {
                val = {
                  chPathLogo: responseJsonFromServer.tmpFileName,
                }

                this.props.onEdit(val);  // вызываем action
                message.success('Изменения сохранены');
                
              }
            }).catch((error) => {
                console.error(error);
            });            
          }
        });
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
        const tmpFilePath = this.props.optionapp[0].serverUrl +  "/UploadFile.php?fName=" + tmpFileName;

        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Загрузить</div>
          </div>
        );


        return (<div>
            <HeaderSection title="Оформление" icon="icon-orders"/>
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                    
                    <FormItem
                    label="Логотип"
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
            </Content>          
        </div>)
    }
}

const WrappedNormalForm = Form.create()(Customisation);

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