import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Tooltip, message, Switch, Modal } from 'antd';
import { connect } from 'react-redux';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

const FormItem = Form.Item;

class TagsForm extends Component {

    constructor(props) {
      super(props);
      this.state = {
        chColor: this.props.type !== "0" ? `#${this.props.param.chColor}` : `#36c`
      };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { chColor } = this.state;

        this.props.form.validateFields((err, values) => {
          if (!err) {
            var val = {};
            if (this.props.type === '1') {
              const url = this.props.optionapp[0].serverUrl + "/EditTags.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  idTag: this.props.param.idTag,
                  chName: values.chName,
                  enShow: values.enShow ? "1" : "0",
                  chColor: chColor.slice(1),
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                if (responseJsonFromServer.status) {
                  val = {
                      idTag: this.props.param.idTag,
                      chName: values.chName,
                      enShow: values.enShow ? "true" : "false",
                      chColor: chColor.slice(1),
                  }

                  this.props.onEdit(val);  // вызываем action
                  message.success('Тег изменен');
                }
              }).catch((error) => {
                  console.error(error);
              });

            } else {

              const url = this.props.optionapp[0].serverUrl + "/InsertTags.php"; // добавляем категорию
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
                  chName: values.chName,
                  enShow: values.enShow ? "1" : "0",
                  chColor: chColor.slice(1),
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    idTag: responseJsonFromServer.id.toString(),
                    chName: values.chName,
                    enShow: values.enShow ? "true" : "false",
                    chColor: chColor.slice(1),
                  }
                }

                this.props.onAdd(val);  // вызываем action
                message.success('Тег создан'); 
                this.props.form.resetFields(); // ресет полей

                this.props.form.setFieldsValue({
                  'enShow': true,
                  'chName': "",
                });

                this.setState({
                  chColor: `#36c`,
                });

              }).catch((error) => {
                  console.error(error);
              });
            }
          }
        });
      }

    delete = () => {
      const url = this.props.optionapp[0].serverUrl + "/DeleteTags.php"; // удаление
      
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
              idTag: this.props.param.idTag,
           })
        }).then((response) => response.json()).then((responseJsonFromServer) =>
        {
            var val = {
              idTag: this.props.param.idTag,
            }
            this.props.onDelete(val);  // вызываем action
        }).catch((error) =>
        {
            console.error(error);
        });
        message.success('Тег удален'); 
        this.props.handler();
        
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.param !== this.props.param) {

        if (nextProps.type === "0") {
          this.props.form.setFieldsValue({
            'enShow': true,
            'chName': '',
          });

          this.setState({
            chColor: `#36c`,
          });
        
        }

        if (nextProps.type === "2" || nextProps.type === "1") {
          this.props.form.setFieldsValue({
            'enShow': nextProps.param.enShow === "true",
            'chName': nextProps.param.chName + `${nextProps.type === "2" ? " - Копия" : "" }`,
          });

          this.setState({
            chColor: `#${nextProps.param.chColor}`,
          });

        }
      
      }
    }

    changeHandler = ({color}) => {
      this.setState({
        chColor: color,
      });
      
    }
      
    closeHandler = ({color}) => {
      this.setState({
        chColor: color,
      });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { chColor } = this.state;
        const labelColSpan = 8;

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
               <h4>Удалить тег</h4>
               <Popconfirm title="Удалить тег?" onConfirm={() => this.delete()} okText="Да" cancelText="Нет">
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
              label={
                <span>
                    Имя&nbsp;
                    <Tooltip title='Текст тега. До 9 символов'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите текст тега' }],
                initialValue: this.props.type !== "0" ? this.props.param.chName + `${this.props.type === "2" ? " - Копия" : "" }` : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Текст тега" maxLength="9"/>
              )}
            </FormItem>
            <div className="ant-form-item-label">
              <label><span>
                      Цвет&nbsp;
                      <Tooltip title='Фон тега для отображения в приложении. Цвет шрифта "белый".'>
                          <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                      </Tooltip>
                  </span>
              </label>
            </div>
            <div style={{ margin: '0px 0px 20px'}}>
            <ColorPicker
                color={chColor}
                enableAlpha={false} 
                onChange={this.changeHandler}
                onClose={this.closeHandler}
                placement="topLeft"
                className="some-class"
                >
                <span className="rc-color-picker-trigger"/>
            </ColorPicker>
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

const WrappedNormalLoginForm = Form.create()(TagsForm);

export default connect (
  state => ({
      tags: state.tags,
      optionapp: state.optionapp,
      owner: state.owner,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_TAG', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_TAG', payload: data});
    },
    
    onDelete: (data) => {
      dispatch({ type: 'DELETE_TAG', payload: data});
    },
  })
)(WrappedNormalLoginForm);
