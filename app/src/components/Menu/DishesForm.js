import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Table, message, Switch, Select, Upload, Modal } from 'antd';
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
          dataSource: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).ingredients : 
            this.props.copyrecord.length !== 0 ? this.props.copyrecord.ingredients : [],
          count: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).ingredients.length + 1 : 
            this.props.copyrecord.length !== 0 ? this.props.copyrecord.ingredients.length + 1 : 0,
          iCategories: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).iCategories : 
            this.props.copyrecord.length !== 0 ? this.props.copyrecord.iCategories : '',
          chOptionSets: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chOptionSets : 
            this.props.copyrecord.length !== 0 ? this.props.copyrecord.chOptionSets : [],
          chTags: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chTags : 
            this.props.copyrecord.length !== 0 ? this.props.copyrecord.chTags : [],
          arrTags: [
            {key: "1", chName: "Острая"},
            {key: "2", chName: "Веган"},
            {key: "3", chName: "Рекомендуем"},
          ],
          previewVisible: false,
          previewImage: '',
          tmpFileName: generateKey(),
          fileList: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chMainImage.length ? [{
            uid: '-1',
            name: this.props.dishes.find(x => x.idDishes ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
            status: 'done',
            url: this.props.dishes.find(x => x.idDishes ===  this.props.param).chMainImage,
            
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
    
    componentWillUnmount() {
        this.DeleteTmpFile(); // удаляем временную картинку
      }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

          if (!err) {
            var val = {};
            if (this.props.param) {

              const url = this.props.optionapp[0].serverUrl + "/EditProducts.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  idDishes: this.props.param,
                  enShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chSubtitle: values.chSubtitle,
                  chPrice: values.chPrice,
                  chOldPrice: values.chOldPrice,
                  chDescription: values.chDescription,
                  iCategories: this.state.iCategories,
                  chOptionSets: values.chOptionSets,
                  chTags: values.chTags,
                  ingredients: this.state.dataSource,
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
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
                    chTags: values.chTags,
                    ingredients: this.state.dataSource,
                    chMainImage:responseJsonFromServer, 
                  }
                }
                this.props.onEdit(val);  // вызываем action
                message.success('Товар изменен');
                this.props.form.resetFields(); // ресет полей

              }).catch((error) => {
                  console.error(error);
              });

            } else {

              const url = this.props.optionapp[0].serverUrl + "/InsertProducts.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  enShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chSubtitle: values.chSubtitle,
                  chPrice: values.chPrice,
                  chOldPrice: values.chOldPrice,
                  chDescription: values.chDescription,
                  iCategories: this.state.iCategories,
                  chOptionSets: values.chOptionSets,
                  chTags: values.chTags,
                  ingredients: this.state.dataSource,
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                val = {
                  dataload: { 
                    key: responseJsonFromServer.id.toString(),
                    idDishes: responseJsonFromServer.id.toString(),
                    enShow: values.enShow.toString(),
                    chName: values.chName,
                    chNamePrint: values.chNamePrint,
                    chSubtitle: values.chSubtitle,
                    chPrice: values.chPrice,
                    chOldPrice: values.chOldPrice,
                    chDescription: values.chDescription,
                    iCategories: this.state.iCategories,
                    chOptionSets: values.chOptionSets,
                    chTags: values.chTags,
                    ingredients: this.state.dataSource,
                    chMainImage: responseJsonFromServer.tmpFileName, 
                  }
                }

                this.props.onAdd(val);  // вызываем action
                message.success('Товар создан'); 
                this.props.form.resetFields(); // ресет полей
                this.setState({ 
                  count: 0,
                  iCategories: '',
                  chOptionSets: [],
                  chTags: [],
                  dataSource: [], 
                  tmpFileName: generateKey(),
                  fileList: [],
                });

              }).catch((error) => {
                  console.error(error);
              });
              
            }
          }
        });
      }

      DeleteDishes = () => {
        const url = this.props.optionapp[0].serverUrl + "/DeleteProducts.php"; // удаление
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
                idDishes: this.props.param,
                tmpFileName: this.state.fileList.length ? this.state.fileList[0].name : "",
             })
          }).then((response) => response.json()).then((responseJsonFromServer) =>
          {
              var val = {
                idDishes: this.props.param,
              }
              this.props.onDelete(val);  // вызываем action
          }).catch((error) =>
          {
              console.error(error);
          });
          message.success('Товар удалена'); 
          this.props.handler();
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

    onChangeTag = (value) => {
      this.setState({
        chTags: value,
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

      if ((nextProps.copyrecord !== this.props.copyrecord)&&(nextProps.copyrecord.length !== 0)) {
        this.setState(
          { 
            dataSource: nextProps.copyrecord.ingredients,
            count: nextProps.copyrecord.ingredients.length + 1,
            iCategories: nextProps.copyrecord.iCategories,
            chOptionSets: nextProps.copyrecord.chOptionSets,
            chTags: nextProps.copyrecord.chTags
          })
      }


      if(nextProps.param !== this.props.param) {
                
        this.DeleteTmpFile(); // удаляем временный файл

        this.props.form.setFieldsValue({
          'enShow': this.props.dishes.find(x => x.idDishes ===  nextProps.param).enShow === "true",
          'chName': this.props.dishes.find(x => x.idDishes ===  nextProps.param).chName,
          'chNamePrint': this.props.dishes.find(x => x.idDishes ===  nextProps.param).chNamePrint,
          'chSubtitle': this.props.dishes.find(x => x.idDishes ===  nextProps.param).chSubtitle,
          'chPrice': this.props.dishes.find(x => x.idDishes ===  nextProps.param).chPrice,
          'chOldPrice': this.props.dishes.find(x => x.idDishes ===  nextProps.param).chOldPrice,
          'chDescription': this.props.dishes.find(x => x.idDishes ===  nextProps.param).chDescription,
          'iCategories': this.props.dishes.find(x => x.idDishes ===  this.props.param).iCategories,
          'chOptionSets': this.props.dishes.find(x => x.idDishes ===  this.props.param).chOptionSets,
          'chTags': this.props.dishes.find(x => x.idDishes ===  this.props.param).chTags,
        });
        this.setState(
          { 
            dataSource: this.props.dishes.find(x => x.idDishes ===  nextProps.param).ingredients,
            count: this.props.dishes.find(x => x.idDishes ===  nextProps.param).ingredients.length + 1,
            tmpFileName: generateKey(),
            fileList: this.props.dishes.find(x => x.idDishes ===  nextProps.param).chMainImage.length ? [{
              uid: '-1',
              name: this.props.dishes.find(x => x.idDishes ===  this.props.param).chMainImage.replace(/^.*(\\|\/|\:)/, ''),
              status: 'done',
              url: this.props.dishes.find(x => x.idDishes ===  nextProps.param).chMainImage,
            }] : [],
          })
      }
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
        const labelColSpan = 8;
        const { dataSource, iCategories, chOptionSets, chTags, previewVisible, previewImage, fileList, tmpFileName } = this.state;
        const tmpFilePath = this.props.optionapp[0].serverUrl + "/UploadFile.php?fName=" + tmpFileName;
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };

        const options = this.props.categories.map(d => <Option key={d.idCategories}>{d.chName}</Option>)
        const children = this.state.arrTags.map(d => <Option key={d.key}>{d.chName}</Option>);
        const childrenOptionSets = this.props.optionSets.map(d => <Option key={d.idOptionSets}>{d.chName}</Option>)

        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Загрузить</div>
          </div>
        );
        
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
               <h4>Удалить товар</h4>
               <Popconfirm title="Удалить товар?" onConfirm={() => this.DeleteDishes()} okText="Да" cancelText="Нет">
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
                rules: [{ required: true, message: 'Введите наименование товара' }],
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chName : 
                  this.props.copyrecord.length !== 0  ? this.props.copyrecord.chName + " - Копия" : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Наименование товара" />
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chNamePrint : 
                  this.props.copyrecord.length !== 0  ? this.props.copyrecord.chNamePrint : ""
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chSubtitle : 
                  this.props.copyrecord.length !== 0  ? this.props.copyrecord.chSubtitle : ""
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
                rules: [{ required: true, message: 'Введите стоимость товара' }],
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chPrice : 
                  this.props.copyrecord.length !== 0  ? this.props.copyrecord.chPrice : ""
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chOldPrice : 
                  this.props.copyrecord.length !== 0  ? this.props.copyrecord.chOldPrice : ""
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
                initialValue: this.props.param ? this.props.dishes.find(x => x.idDishes ===  this.props.param).chDescription : 
                  this.props.copyrecord.length !== 0  ? this.props.copyrecord.chDescription : ""
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
                  onChange={this.onChangeOptionSets}
                >
                  <Option key="0">Выберите набор опций</Option>
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
                initialValue: chTags,
              })(
                <Select
                  mode="tags"
                  onChange={this.onChangeTag}
                >
                {children}
              </Select>
              )}
            </FormItem>
            <FormItem
              label="Изображение"
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
                locale={{emptyText: 'Нет данных'}}
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
      optionapp: state.optionapp,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_DISHES', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_DISHES', payload: data});
    },
    onDelete: (optionSetsData) => {
      dispatch({ type: 'DELETE_DISHES', payload: optionSetsData});
    },
  })
)(WrappedNormalLoginForm);
