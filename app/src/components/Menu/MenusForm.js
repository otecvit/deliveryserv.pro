import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, TimePicker , message, Switch, Select, Radio, Checkbox, Row, Col } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const generateKey = (pre) => {
  return `${ new Date().getTime() }`;
}


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} обязательно.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}



class MenusForm extends React.Component {

    constructor(props) {
        super(props);
        
    
        this.state = {
          arrCategories: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).arrCategories : [],
          arrDays: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).arrDays : [],
          blDays: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).blDays === "true" : true,
          blTimes: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).blTimes === "true" : true,
        };
      }

      searchSelectedRow = (param) => { // возвращает значение key для множественного выбора
        if (this.props.optionSets.find(x => x.idOptionSets ===  param).blNecessarily === "true")
          return this.props.optionSets.find(x => x.idOptionSets ===  param).options.find(y => y.blDefault === "true").key;
        else
          return "0";
      }

      handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
      }
    
      handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
          key: count.toString(),
          chName: 'Введите наименование',
          iSort: '100',
        };
        this.setState({
          dataSource: [...dataSource, newData],
          count: count + 1,
        });
      }
    
      handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ dataSource: newData });
      }
    


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

          if (!err) {
            var val = {};
            if (this.props.param) {

              val = {
                dataload: { 
                  key: this.props.param,
                  idMenus: this.props.param,
                  enShow: values.enShow.toString(),
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chDescription: values.chDescription,
                  arrCategories: this.state.arrCategories,
                  blDays: this.state.blDays ? "true" : "false",
                  arrDays: this.state.blDays ? [] : this.state.arrDays,
                  blTimes: this.state.blTimes ? "true" : "false",
                  chStartInterval: this.state.blTimes ? "0:00:00" : values.chStartInterval._i,
                  chEndInterval: this.state.blTimes ? "23:59:59" : values.chEndInterval._i,
                }
              }

              
              console.log(val);
              
              this.props.onEdit(val);  // вызываем action
              message.success('Меню изменено');
              this.props.form.resetFields(); // ресет полей
              

            } else {
              
              val = {
                dataload: { 
                  key: generateKey(),
                  idMenus: generateKey(),
                  enShow: values.enShow.toString(),
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chDescription: values.chDescription,
                  arrCategories: this.state.arrCategories,
                  blDays: this.state.blDays ? "true" : "false",
                  arrDays: this.state.blDays ? [] : this.state.arrDays,
                  blTimes: this.state.blTimes ? "true" : "false",
                  chStartInterval: this.state.blTimes ? "0:00:00" : values.chStartInterval._i,
                  chEndInterval: this.state.blTimes ? "23:59:59" : values.chEndInterval._i,
                }
              }

              console.log(val);
              
              this.props.onAdd(val);  // вызываем action
              message.success('Меню создано'); 
              this.props.form.resetFields(); // ресет полей
              this.setState({ 
                arrCategories: [],
                arrDays: [],
                blDays: true,
                blTimes: true,
              });
              
            }
          }
        });
      }

      DeleteDishes = () => {
      var val = {
          idDishes: this.props.param,
      }
      this.props.onDeleteOptionSet(val);  // вызываем action
      this.props.handler();
      message.success('Набор опций удален'); 
    }


    onChangeCategories = (value) => {
      this.setState({
        iCategories: value,
      })
    }

    onChangeOptionSets = (value) => {
      this.setState({
        chOptionSets: value,
      })
    }

    onChangeBlDays = (e) => {
        this.setState({
            /*blDay: this.props.optionSets.find(x => x.idOptionSets ===  param).blNecessarily === "true",*/
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

    onSelectChange = (selectedRowKeys) => {
      this.setState({ 
        selectedRowKeys,
        dataSource: this.state.dataSource.map(item => {
          selectedRowKeys[0] === item.key ? item.blDefault = "true" : item.blDefault = "false"
          return item;
        })
      });
      
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.param !== this.props.param) {
        this.props.form.setFieldsValue({
          'enShow': this.props.menus.find(x => x.idMenus ===  nextProps.param).enShow === "true",
          'blDays': this.props.menus.find(x => x.idMenus ===  nextProps.param).blDays,
          'blTimes': this.props.menus.find(x => x.idMenus ===  nextProps.param).blTimes,
        });

        this.setState({
            arrCategories: this.props.menus.find(x => x.idMenus ===  nextProps.param).arrCategories,
            blDays: this.props.menus.find(x => x.idMenus ===  nextProps.param).blDays === "true",
            arrDays: this.props.menus.find(x => x.idMenus ===  nextProps.param).arrDays,
            blTimes: this.props.menus.find(x => x.idMenus ===  nextProps.param).blTimes === "true",
        });

      }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelColSpan = 8;
        const { arrCategories, blDays, arrDays, blTimes, chTags } = this.state;
        const format = 'HH:mm';

        const listCategories = this.props.categories.map(d => <Col span={24} key={d.idCategories}><Checkbox key={d.idCategories} value={d.idCategories}>{d.chName}</Checkbox></Col>)
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
               <h4>Удалить блюдо</h4>
               <Popconfirm title="Удалить блюдо?" onConfirm={() => this.DeleteDishes()} okText="Да" cancelText="Нет">
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
                initialValue: this.props.param ? (this.props.menus.find(x => x.idMenus ===  this.props.param).enShow === "true" ) : true,
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
                rules: [{ required: true, message: 'Введите наименование блюда' }],
                initialValue: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).chName : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Наименование блюда" />
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
                initialValue: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).chNamePrint : ""
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
              {getFieldDecorator('chDescription', {
                rules: [{ }],
                initialValue: this.props.param ? this.props.menus.find(x => x.idMenus ===  this.props.param).chDescription : ""
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
                        initialValue: this.props.param ? moment(this.props.menus.find(x => x.idMenus ===  this.props.param).chStartInterval, format) : moment('0:00:00', format)
                    })(
                        <TimePicker format={format} />
                    )}
                </FormItem> 
                <FormItem
                    label="Окончание"  
                    abelCol={{ span: labelColSpan }}
                    style={{ marginBottom: 10 }}
                    >
                    {getFieldDecorator('chEndInterval', {
                        initialValue: this.props.param ? moment(this.props.menus.find(x => x.idMenus ===  this.props.param).chEndInterval, format) : moment('23:59:59', format)
                    })(
                        <TimePicker format={format} />
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
        </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(MenusForm);

export default connect (
  state => ({
      menus: state.menus,
      categories: state.categories,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_MENUS', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_MENUS', payload: data});
    },
    onDeleteOptionSet: (optionSetsData) => {
      dispatch({ type: 'DELETE_OPTION_SETS', payload: optionSetsData});
    },
  })
)(WrappedNormalLoginForm);
