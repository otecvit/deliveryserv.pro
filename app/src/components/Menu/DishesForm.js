import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Table, message, Switch, Select } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const Option = Select.Option;
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



class DishesForm extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [{
          title: 'Наименивание',
          dataIndex: 'chName',
          width: '25%',
          editable: true,
        }, {
          title: 'Сортировка',
          dataIndex: 'iSort',
          width: '25%',
          editable: true,
        }, {
          title: 'Действие',
          dataIndex: 'operation',
          render: (text, record) => {
            return (
              this.state.dataSource.length >= 1
                ? (
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                    <a href="javascript:;">Delete</a>
                  </Popconfirm>
                ) : null
            );
          },
        }];
    
        this.state = {
          dataSource: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).ingredients : [],
          count: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).ingredients.length + 1 : 0,
          iCategories: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).iCategories : '',
          chOptionSets: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chOptionSets : [],
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
          chPriceChange: '0',
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

          // при включеном обязательном выборе, проверяем выбранную опцию по умолчанию
          if ((this.state.dataSource.findIndex(item => item.blDefault === "true") === -1)&&(values.blNecessarily)) {
            message.error('Выберите опцию по умолчанию');
            return;
          }////////////////

          if (!err) {
            var val = {};
            if (this.props.param) {

              val = {
                dataload: { 
                  key: this.props.param,
                  idDishes: this.props.param,
                  enShow: values.enShow.toString(),
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chSubtitle: values.chSubtitle,
                  chPrice: values.chPrice,
                  chOldPrice: values.chOldPrice,
                  chDescription: values.chDescription,
                  iCategories: this.state.iCategories,
                  chOptionSets: values.chOptionSets,
                  /*
                  //chDefOptionSet: values.chDefOptionSet
                  chTags: values.chTags,
                  ingredients: this.state.dataSource,*/
                }
              }

              
              console.log(val);
              
              this.props.onEdit(val);  // вызываем action
              message.success('Блюдо изменено');
              this.props.form.resetFields(); // ресет полей
              

            } else {
              
              val = {
                dataload: { 
                  key: generateKey(),
                  idOptionSets: generateKey(),
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow.toString(),
                  blNecessarily: values.blNecessarily.toString(),
                  blMultiple: values.blMultiple.toString(),
                  options: this.state.dataSource,
                }
              }

              console.log(val);
              
              this.props.onAddOptionSets(val);  // вызываем action
              message.success('Набор опций создан'); 
              this.props.form.resetFields(); // ресет полей
              this.setState({ dataSource: [] });
              
            }
          }
        });
      }

      DeleteOption = () => {
      var val = {
          idOptionSets: this.props.param,
      }
      this.props.onDeleteOptionSet(val);  // вызываем action
      this.props.handler();
      message.success('Набор опций удален'); 
    }

    onChangeMultiple = (checked) => {
      this.setState({
        blNecessarily: checked,
      })

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
          'enShow': this.props.optionSets.find(x => x.idOptionSets ===  nextProps.param).enShow === "true",
        });
        this.setState(
          { 
            dataSource: this.props.optionSets.find(x => x.idOptionSets ===  nextProps.param).options,
            selectedRowKeys: this.searchSelectedRow(nextProps.param),
          })
        this.onChangeMultiple(this.props.optionSets.find(x => x.idOptionSets ===  nextProps.param).blNecessarily === "true");
      }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const labelColSpan = 8;
        const { dataSource, blNecessarily, selectedRowKeys, iCategories, chOptionSets } = this.state;
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };

        const options = this.props.categories.map(d => <Option key={d.idCategories}>{d.chName}</Option>)
        const children = [
          <Option key="1">Острая</Option>,
          <Option key="2">Веган</Option>,
          <Option key="3">Супер цена</Option>,
        ];
        const childrenOptionSets = this.props.optionSets.map(d => <Option key={d.idOptionSets}>{d.chName}</Option>)


        
        const columns = this.columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
            }),
        };
        });
        
        var stateSelection = blNecessarily ? { 
          rowSelection: {
            columnTitle: 'По умолчанию', 
            type: 'radio', 
            columnWidth: '13%',
            selectedRowKeys,
            onChange: this.onSelectChange,
          } 
        } : null; // добавляем или удаляем столбец "По умолчанию"

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
               <Popconfirm title="Удалить блюдо?" onConfirm={() => this.DeleteOption()} okText="Да" cancelText="Нет">
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
                initialValue: this.props.param ? (this.props.dishes.find(x => x.idDishes ===  this.props.param).enShow === "true" ) : true,
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chName : ""
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chNamePrint : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" />
              )}
            </FormItem>
            <FormItem
              label="Подзаголовок"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chSubtitle', {
                rules: [{ }],
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chSubtitle : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Подзаголовок" />
              )}
            </FormItem>
            <FormItem
              label="Цена"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chPrice', {
                rules: [{ required: true, message: 'Введите стоимость блюда' }],
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chPrice : ""
              })(
                <Input prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Цена" />
              )}
            </FormItem>
            <FormItem
              label="Старая цена"  
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chOldPrice', {
                rules: [{ }],
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chOldPrice : ""
              })(
                <Input prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Старая цена" />
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chDescription : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Описание" />
              )}
            </FormItem>
            <FormItem 
              label="Категория"
               style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('iCategories', {
                rules: [{ required: true, message: 'Выберите категорию' }],
                initialValue: iCategories,
              })(
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.onChangeCategories}
                >
                {options}
              </Select>
              )}
            </FormItem>
            <FormItem 
              label="Набор опций"
               style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chOptionSets', {
                initialValue: chOptionSets,
              })(
                <Select
                  mode="tags"
                  onChange={this.onChangeOptionSets}
                >
                {childrenOptionSets}
              </Select>
              )}
            </FormItem>
            <FormItem 
              label="Тэги"
               style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chTags', {
                initialValue: "Острая",
              })(
                <Select
                  mode="tags"
                  /*onChange={this.onChangeClient}*/
                >
                {children}
              </Select>
              )}
            </FormItem>
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Добавить ингридиент
                </Button>
                <Table
                components={components}
                rowClassName={() => 'editable-row'}
                size="small"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                {...stateSelection}
                
                />
            </div>

            
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

const WrappedNormalLoginForm = Form.create()(DishesForm);

export default connect (
  state => ({
      dishes: state.dishes,
      categories: state.categories,
      optionSets: state.optionSets,
  }),
  dispatch => ({
    onAddOptionSets: (optionSetsData) => {
      dispatch({ type: 'ADD_OPTION_SETS', payload: optionSetsData});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_DISHES', payload: data});
    },
    onDeleteOptionSet: (optionSetsData) => {
      dispatch({ type: 'DELETE_OPTION_SETS', payload: optionSetsData});
    },
  })
)(WrappedNormalLoginForm);
