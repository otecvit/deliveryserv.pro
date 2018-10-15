import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Table, message, Switch } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;
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

class EditableCell extends React.Component {
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



class OptionSetsForm extends React.Component {

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
          title: 'Изменение цены',
          dataIndex: 'chPriceChange',
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
          dataSource: this.props.param ? this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).options : [],
          blNecessarily: this.props.param ? this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).blNecessarily === "true" : false,
          count: this.props.param ? this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).options.length + 1 : 0,
          selectedRowKeys: this.props.param ? this.searchSelectedRow(this.props.param) : null,
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
                  idOptionSets: this.props.param,
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  enShow: values.enShow.toString(),
                  blNecessarily: values.blNecessarily.toString(),
                  blMultiple: values.blMultiple.toString(),
                  options: this.state.dataSource,
                }
              }
              
              //console.log(val);
              
              this.props.onEditOptionSets(val);  // вызываем action
              message.success('Набор опций изменен');
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
              
              //this.props.onAddCategory(val);  // вызываем action
              message.success('Категория создана'); 
              this.props.form.resetFields(); // ресет полей
              
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
          'blMultiple': this.props.optionSets.find(x => x.idOptionSets ===  nextProps.param).blMultiple === "true",
          'blNecessarily': this.props.optionSets.find(x => x.idOptionSets ===  nextProps.param).blNecessarily === "true",
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
        const { dataSource, blNecessarily, selectedRowKeys } = this.state;
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };
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
               <h4>Удалить категорию</h4>
               <Popconfirm title="Удалить набор опций?" onConfirm={() => this.DeleteOption()} okText="Да" cancelText="Нет">
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
                initialValue: this.props.param ? (this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).enShow === "true" ) : true,
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
                rules: [{ required: true, message: 'Введите имя набора опций' }],
                initialValue: this.props.param ? this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).chName : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Имя набора опций" />
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
                initialValue: this.props.param ? this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).chNamePrint : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" />
              )}
            </FormItem>
            <FormItem
              label="Обязательный набор"
            >
              {getFieldDecorator('blNecessarily', { 
                initialValue: this.props.param ? (this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).blNecessarily  === "true" ) : false,
                valuePropName: 'checked',
              })(
                <Switch onChange={this.onChangeMultiple}/>
              )}
            </FormItem>
            <FormItem 
              label="Множественный выбор"
            >
              {getFieldDecorator('blMultiple', { 
                initialValue: this.props.param ? (this.props.optionSets.find(x => x.idOptionSets ===  this.props.param).blMultiple  === "true" ) : false,
                valuePropName: 'checked',
              })(
                <Switch />
              )}
            </FormItem>
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Добавить опцию
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

const WrappedNormalLoginForm = Form.create()(OptionSetsForm);

export default connect (
  state => ({
      optionSets: state.optionSets,
  }),
  dispatch => ({
    onAddCategory: (categoryData) => {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData});
    },
    onEditOptionSets: (optionSetsData) => {
      dispatch({ type: 'EDIT_OPTION_SETS', payload: optionSetsData});
    },
    onDeleteOptionSet: (optionSetsData) => {
      dispatch({ type: 'DELETE_OPTION_SETS', payload: optionSetsData});
    },
  })
)(WrappedNormalLoginForm);
