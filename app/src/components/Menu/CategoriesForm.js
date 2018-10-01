import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;


class CategoriesForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelColSpan = 8;

        return (
        <Form onSubmit={this.handleSubmit} className="login-form" layout="vertical" style={{marginTop: "15px"}}>
        <FormItem
          label="Имя"
          abelCol={{ span: labelColSpan }}
          style={{ marginBottom: 10 }}
          hasFeedback
        >
          {getFieldDecorator('chName', {
            rules: [{ required: true, message: 'Введите имя категории' }],
            initialValue: this.props.param ? this.props.param : ""
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
          })(
            <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" />
          )}
        </FormItem>
        <FormItem
        
        >
          <Button type="primary" htmlType="submit">
            <Icon type="plus"/>Сохранить
          </Button>
        </FormItem>
      </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(CategoriesForm);

export default WrappedNormalLoginForm;