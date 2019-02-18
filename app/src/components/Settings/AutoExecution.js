import React, { Component } from 'react'
import { Form, Icon, Input, Button, Popconfirm, Upload, message, Switch, Modal, Layout, Select } from 'antd';
import { connect } from 'react-redux';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class AutoExecution extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blAutoComplete: this.props.owner.blAutoComplete === "true"
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {

          }
        });
      }

     onChange = (checked) => {
        this.setState({
            blAutoComplete: checked,
        })
  
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { blAutoComplete } = this.state;
        const labelColSpan = 8;

        return (<div>
            <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                <div className="title-section"><Icon type="clock-circle" style={{ fontSize: '16px', marginRight: "10px"}}/>Автовыполнение заказа</div>
            </div>
            </Content>  
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
                <FormItem
                    label="Разрешить автоматическое изменение статуса заказа"
                    >
                    {getFieldDecorator('blAutoComplete', { 
                        initialValue: this.props.owner.blAutoComplete === "true",
                        valuePropName: 'checked'
                    })(
                        <Switch onChange={this.onChange}/>
                    )}
                </FormItem>
                { blAutoComplete ?
                <div>
                    <FormItem
                        label='Время до изменения статуса "Выполнен" (минут)'
                        abelCol={{ span: labelColSpan }}
                        style={{ marginBottom: 10 }}
                        hasFeedback
                        >
                        {getFieldDecorator('iDaysAhead', {
                            rules: [],
                            initialValue: this.props.owner.iDaysAhead
                        })(
                            <Input prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="7" />
                        )}
                    </FormItem>
                        </div>
                    : null }
                    <FormItem>
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

const WrappedNormalForm = Form.create()(AutoExecution);

export default connect (
  state => ({
      stock: state.stock,
      optionapp: state.optionapp,
      owner: state.owner,
  }),
  dispatch => ({
    onEdit: (data) => {
      dispatch({ type: 'EDIT_OWNER', payload: data});
    },
  })
)(WrappedNormalForm);