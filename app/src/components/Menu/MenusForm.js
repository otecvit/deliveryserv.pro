import React, { Component, Fragment } from 'react';
import { Form, Icon, Input, Button, Popconfirm, TimePicker , message, Switch, Select, Radio, Checkbox, Row, Col } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class MenusForm extends Component {

      state = {
          arrCategories: this.props.type !== "0" ? this.props.param.arrCategories : [],
          arrDays: this.props.type !== "0" ? this.props.param.arrDays : [],
          blDays: this.props.type !== "0" ? this.props.param.blDays === "true" : true,
          blTimes: this.props.type !== "0" ? this.props.param.blTimes === "true" : true,
          chStartInterval: this.props.type !== "0" ? this.props.param.chStartInterval : "0:00:00",
          chEndInterval: this.props.type !== "0" ? this.props.param.chEndInterval : "23:59:59",
      };

    handleSubmit = (e) => {
        e.preventDefault();
        const { chUID } = this.props.owner;
        const { chStartInterval, chEndInterval } = this.state;

        this.props.form.validateFields((err, values) => {

          if (!err) {
            var val = {};
            if (this.props.type === '1') {

              const url = `${this.props.optionapp[0].serverUrl}/EditMenus.php`; // изменяем категорию
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  idMenus: this.props.param.idMenus,
                  chName: values.chName,
                  enShow: values.enShow ? "1" : "0",
                  chDescription: values.chDescription,
                  arrCategories: this.state.arrCategories,
                  blDays: this.state.blDays ? "1" : "0",
                  arrDays: this.state.blDays ? [] : this.state.arrDays,
                  blTimes: this.state.blTimes ? "1" : "0",
                  chStartInterval: this.state.blTimes === "1" ? "0:00:00" : chStartInterval,
                  chEndInterval: this.state.blTimes === "1" ? "23:59:59" : chEndInterval,
                  
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: this.props.param.idMenus,
                    idMenus: this.props.param.idMenus,
                    enShow: values.enShow.toString(),
                    chName: values.chName,
                    chDescription: values.chDescription,
                    arrCategories: this.state.arrCategories,
                    blDays: this.state.blDays ? "true" : "false",
                    arrDays: this.state.blDays ? [] : this.state.arrDays,
                    blTimes: this.state.blTimes ? "true" : "false",
                    chStartInterval: this.state.blTimes === "1" ? "0:00:00" : chStartInterval,
                    chEndInterval: this.state.blTimes === "1" ? "23:59:59" : chEndInterval,
                  }
                }
                this.props.onEdit(val);  // вызываем action
                message.success('Меню изменено');
                this.props.form.setFieldsValue({
                  'enShow': values.enShow.toString() === "true",
                  'chName': values.chName,
                });

              }).catch((error) => {
                  console.error(error);
              });
            } else {

              const url = this.props.optionapp[0].serverUrl + "/InsertMenus.php"; // добавляем набор
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: chUID,
                  chName: values.chName,
                  enShow: values.enShow ? "1" : "0",
                  chDescription: values.chDescription,
                  arrCategories: this.state.arrCategories,
                  blDays: this.state.blDays ? "1" : "0",
                  arrDays: this.state.blDays ? [] : this.state.arrDays,
                  blTimes: this.state.blTimes === "1" ? "1" : "0",
                  chStartInterval: this.state.blTimes === "1" ? "0:00:00" : chStartInterval,
                  chEndInterval: this.state.blTimes === "1" ? "23:59:59" : chEndInterval,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: responseJsonFromServer.toString(),
                    idMenus: responseJsonFromServer.toString(),
                    enShow: values.enShow.toString(),
                    chName: values.chName,
                    chDescription: values.chDescription,
                    arrCategories: this.state.arrCategories,
                    blDays: this.state.blDays ? "true" : "false",
                    arrDays: this.state.blDays ? [] : this.state.arrDays,
                    blTimes: this.state.blTimes ? "true" : "false",
                    chStartInterval: this.state.blTimes === "1" ? "0:00:00" : chStartInterval,
                    chEndInterval: this.state.blTimes === "1" ? "23:59:59" : chEndInterval,
                  }
                }

                this.props.onAdd(val);  // вызываем action
                message.success('Меню создано'); 
                this.props.form.resetFields(); // ресет полей
                this.setState({ 
                  arrCategories: [],
                  arrDays: [],
                  blDays: true,
                  blTimes: true,
                });

              }).catch((error) => {
                  console.error(error);
              });
            }
          }
        });
      }



      delete = () => {
        const url = `${this.props.optionapp[0].serverUrl}/DeleteMenus.php`; // удаление
        fetch(url,
          {
              method: 'POST',
              body: JSON.stringify(
              {
                idMenus: this.props.param.idMenus,
             })
          }).then((response) => response.json()).then((responseJsonFromServer) =>
          {
              var val = {
                idMenus: this.props.param.idMenus,
              }
              this.props.onDelete(val);  // вызываем action
          }).catch((error) =>
          {
              console.error(error);
          });
          this.props.handler();
          message.success('Вариант удален'); 
    }

    onChangeBlDays = (e) => {
        this.setState({
            blDays: !this.state.blDays,
        })
    }

    onChangeArrDays = (checkedValues) => {
      this.setState({
          arrDays: checkedValues,
      })
  }

  onChangeArrCategories = (checkedValues) => {
    this.setState({
        arrCategories: checkedValues,
    })
}

    onChangeBlTimes = (e) => {
        this.setState({
            /*blDay: this.props.optionSets.find(x => x.idOptionSets ===  param).blNecessarily === "true",*/
            blTimes: !this.state.blTimes,
        })
    }


    componentWillReceiveProps(nextProps) {
      if(nextProps.param !== this.props.param) {
        if (nextProps.type === "0") {
          this.props.form.setFieldsValue({
            'enShow': true,
            'chName': '',
          });

        }

        if (nextProps.type === "2" || nextProps.type === "1") {
          this.props.form.setFieldsValue({
            'enShow': nextProps.param.enShow === "true",
            'chName': nextProps.param.chName + `${nextProps.type === "2" ? " - Копия" : "" }`,
          });

        }
      
      }
    }

    handleChangeTime = (timeString, isStartInterval) => {
        if (isStartInterval) {
          this.setState({
            chStartInterval: `${timeString}:00`,
          });
        } else {
          this.setState({
            chEndInterval: `${timeString}:00`,
          });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelColSpan = 8;
        const { arrCategories, blDays, arrDays, blTimes } = this.state;
        const format = 'HH:mm';

        const listCategories = this.props.categories.map(d => <Col span={24} key={d.idCategories}><Checkbox key={d.idCategories} value={d.idCategories}>{d.chName}</Checkbox></Col>)
        
        return (
          <Fragment>
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
               <h4>Удалить меню</h4>
               <Popconfirm title="Удалить вариант?" onConfirm={() => this.delete()} okText="Да" cancelText="Нет">
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
                initialValue: this.props.type !== "0" ? this.props.param.enShow === "true" : true,
                valuePropName: 'checked'
              })(
                <Switch/>
              )}
            </FormItem>
            <FormItem
              label="Имя"
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите наименование варианта' }],
                initialValue: this.props.type !== "0" ? this.props.param.chName : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Наименование" />
              )}
            </FormItem>
            <FormItem
              label="Описание"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chDescription', {
                rules: [{ }],
                initialValue: this.props.type !== "0" ? this.props.param.chDescription : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Описание" />
              )}
            </FormItem>
            <FormItem
            label="Категории"  
            abelCol={{ span: labelColSpan }}
            style={{ marginBottom: 10 }}
            >
            {getFieldDecorator('arrCategories', {
                rules: [{ required: true, message: 'Выберите категорию' }],
                initialValue: arrCategories
            })(
                <Checkbox.Group onChange={this.onChangeArrCategories}>
                <Row>
                    {listCategories}
                </Row>
                </Checkbox.Group>
            )}
            </FormItem>
            <FormItem
            label="Дни недели"  
            abelCol={{ span: labelColSpan }}
            style={{ marginBottom: 10 }}
            >
            {getFieldDecorator('blDays', {
                initialValue: blDays ? "true" : "false"
            })(
                <RadioGroup onChange={this.onChangeBlDays}>
                    <Radio value="true">Ежедневно</Radio>
                    <Radio value="false">Выбрать дни</Radio>
                </RadioGroup>
            )}
            </FormItem>
            { !blDays ? 
            <FormItem
                label="Выбрать дни недели"  
                abelCol={{ span: labelColSpan }}
                style={{ marginBottom: 10 }}
                >
                {getFieldDecorator('arrDays', {
                    rules: [{ required: true, message: 'Выберите день недели' }],
                    initialValue: arrDays
                })(
                    <Checkbox.Group onChange={this.onChangeArrDays} >
                    <Row>
                        <Col span={24}><Checkbox value="1">Понедельник</Checkbox></Col>
                        <Col span={24}><Checkbox value="2">Вторник</Checkbox></Col>
                        <Col span={24}><Checkbox value="3">Среда</Checkbox></Col>
                        <Col span={24}><Checkbox value="4">Четверг</Checkbox></Col>
                        <Col span={24}><Checkbox value="5">Пятница</Checkbox></Col>
                        <Col span={24}><Checkbox value="6">Суббота</Checkbox></Col>
                        <Col span={24}><Checkbox value="7">Воскресенье</Checkbox></Col>
                    </Row>
                    </Checkbox.Group>
                )}
            </FormItem> : null}
            <FormItem
            label="Время действия"  
            abelCol={{ span: labelColSpan }}
            style={{ marginBottom: 10 }}
            >
            {getFieldDecorator('blTimes', {
                initialValue: blTimes ? "true" : "false"
            })(
                <RadioGroup onChange={this.onChangeBlTimes}>
                    <Radio value="true">Постоянно</Radio>
                    <Radio value="false">Интервал</Radio>
                </RadioGroup>
            )}
            </FormItem>
            { !blTimes ? 
            <div>
                <FormItem
                    label="Начало"  
                    abelCol={{ span: labelColSpan }}
                    style={{ marginBottom: 10 }}
                    >
                    {getFieldDecorator('chStartInterval', {
                        initialValue: this.props.type !== "0" ? moment(this.props.param.chStartInterval, format) : moment('0:00:00', format)
                    })(
                        <TimePicker 
                          format={format} 
                          onChange={(time, timeString) => this.handleChangeTime(timeString, true)}
                        />
                    )}
                </FormItem> 
                <FormItem
                    label="Окончание"  
                    abelCol={{ span: labelColSpan }}
                    style={{ marginBottom: 10 }}
                    >
                    {getFieldDecorator('chEndInterval', {
                        initialValue: this.props.type !== "0" ? moment(this.props.param.chEndInterval, format) : moment('23:59:59', format)
                    })(
                        <TimePicker 
                          format={format} 
                          onChange={(time, timeString) => this.handleChangeTime(timeString, false)}
                        />
                    )}
                </FormItem> 
            </div> : null}
            <FormItem
            >
              <Button type="primary" htmlType="submit" style={{marginTop: "15px"}}>
                <Icon type="plus"/>Сохранить
              </Button>
            </FormItem>
          </Form>
        </Fragment>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(MenusForm);

export default connect (
  state => ({
      menus: state.menus,
      optionapp: state.optionapp,
      categories: state.categories,
      owner: state.owner,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_MENUS', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_MENUS', payload: data});
    },
    onDelete: (optionSetsData) => {
      dispatch({ type: 'DELETE_MENUS', payload: optionSetsData});
    },
  })
)(WrappedNormalLoginForm);
