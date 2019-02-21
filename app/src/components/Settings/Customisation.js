import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class Customisation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            tmpFileName: generateKey(),
            fileList: this.props.param ? this.props.categories.find(x => x.idCategories ===  this.props.param).chMainImage.length ? [{
              uid: '-1',
              name: this.props.categories.find(x => x.idCategories ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
              status: 'done',
              url: this.props.categories.find(x => x.idCategories ===  this.props.param).chMainImage,
              
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


          }
        });
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

         const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (<div>
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><IconFont type="icon-orders" style={{ fontSize: '16px', marginRight: "10px"}}/>Оформление</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                    
                    <FormItem
                    label="Логотип"
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