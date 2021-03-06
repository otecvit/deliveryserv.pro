import React, { Component } from 'react';
import { Form, Icon, Input, Button, Popconfirm, Table, message, Switch, Select, Upload, Modal, Tooltip } from 'antd';
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
                      getValueFromEvent: ({currentTarget: {value}}) => {
                        switch (dataIndex) {
                          case 'chName': return value;
                          case 'iSort': {
                            const convertedValue = Number(value);
                            if (isNaN(convertedValue)) {
                              return Number(form.getFieldValue('iSort'));
                            } else {
                              return convertedValue;
                            }
                          }
                          case 'chPriceChange': {
                            const re = /^(\d{0,7}\.\d{0,2}|\d{0,7}|\.\d{0,2})$/;
                            if (re.test(value)) {
                              return value;
                            } else {
                              return Number(form.getFieldValue('chPriceChange'));
                            }
                          }
                        }
                        
                     },
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
          width: '30%',
          editable: true,
         }, {
          title: 'Сортировка',
          dataIndex: 'iSort',
          width: '25%',
          editable: true,
          render: (text) => <div style={{textAlign: 'center'}}>{text}</div>
        }, {
          title: 'Изменение цены',
          dataIndex: 'chPriceChange',
          width: '25%',
          editable: true,
          render: (text) => <div style={{textAlign: 'center'}}>{text}</div>
          }, {
          title: 'Действие',
          dataIndex: 'operation',
          render: (text, record) => {
            return (
              this.state.dataSource.length >= 1
                ? (
                  <div style={{textAlign: 'center'}}>
                  <Popconfirm title="Удалить опцию?" onConfirm={() => this.handleDelete(record.key)}>
                    <a href="javascript:;">Удалить</a>
                  </Popconfirm>
                  </div>
                ) : null
            );
          },
        }];

        
    
        this.state = {
          dataSource: this.props.type !== "0" ? this.props.param.ingredients : [],
          count: this.props.type !== "0" ? this.props.param.ingredients.length + 1 : 0,
          iCategories: this.props.type !== "0" ? this.props.param.iCategories : '',
          chOptionSets: this.props.type !== "0" ? this.props.param.chOptionSets : '0',
          chTags: this.props.type !== "0" ? this.props.param.tags : [],
          arrTags: this.props.tags.map(item => {
            return {
              key: item.idTag, 
              chName: item.chName, 
            }
          }),
          previewVisible: false,
          previewImage: '',
          tmpFileName: generateKey(),
          fileList: this.props.type === "1" ? this.props.param.chMainImage.length ? [{
            uid: '-1',
            name: this.props.param.chMainImage.replace(/^.*(\\|\/|\:)/, ''),
            status: 'done',
            url: this.props.param.chMainImage,
            
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
            if (this.props.type === '1') {

               const url = `${this.props.optionapp[0].serverUrl}/EditProducts.php`; // изменяем товар
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  idDishes: this.props.param.idDishes,
                  enShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chPrice: Number(values.chPrice).toFixed(2),
                  chOldPrice: values.chOldPrice.length ? Number(values.chOldPrice).toFixed(2) : "",
                  chDescription: values.chDescription,
                  iCategories: this.state.iCategories,
                  chOptionSets: this.state.chOptionSets,
                  chTags: values.chTags,
                  ingredients: this.state.dataSource,
                  tmpFileName: this.state.fileList.length ? this.state.tmpFileName + this.state.fileList[0].response : "",
                  chMainImage: this.props.param.chMainImage,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
               
                if (responseJsonFromServer.status) {
                  val = {
                    dataload: { 
                      key: this.props.param.idDishes,
                      idDishes: this.props.param.idDishes,
                      enShow: values.enShow.toString(),
                      chName: values.chName,
                      chNamePrint: values.chNamePrint,
                      chPrice: Number(values.chPrice).toFixed(2),
                      chOldPrice: values.chOldPrice.length ? Number(values.chOldPrice).toFixed(2) : "",
                      chDescription: values.chDescription,
                      iCategories: this.state.iCategories,
                      chOptionSets: this.state.chOptionSets,
                      tags: values.chTags,
                      ingredients: this.state.dataSource,
                      chMainImage: responseJsonFromServer.tmpFileName, 
                    }
                  }

                  this.props.onEdit(val);  // вызываем action
                  message.success('Товар изменен');
                  // подставляем новые значения в форму
                  this.props.form.setFieldsValue({
                    'enShow': values.enShow.toString() === "true",
                    'chName': values.chName,
                    'chNamePrint': values.chNamePrint,
                    'chPrice': Number(values.chPrice).toFixed(2),
                    'chOldPrice': values.chOldPrice.length ? Number(values.chOldPrice).toFixed(2) : "",
                    'chDescription': values.chDescription,
                  });
                  ///////////////////////////////////

                }

              }).catch((error) => {
                  console.error(error);
              });

            } else {

              const url = this.props.optionapp[0].serverUrl + "/InsertProducts.php"; // изменяем категорию
              fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                {
                  chUID: this.props.owner.chUID,
                  enShow: values.enShow ? "1" : "0",
                  chName: values.chName,
                  chNamePrint: values.chNamePrint,
                  chPrice: Number(values.chPrice).toFixed(2),
                  chOldPrice: values.chOldPrice.length ? Number(values.chOldPrice).toFixed(2) : "",
                  chDescription: values.chDescription,
                  iCategories: this.state.iCategories,
                  chOptionSets: this.state.chOptionSets,
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
                    chPrice: Number(values.chPrice).toFixed(2),
                    chOldPrice: values.chOldPrice.length ? Number(values.chOldPrice).toFixed(2) : "",
                    chDescription: values.chDescription,
                    iCategories: this.state.iCategories,
                    chOptionSets: this.state.chOptionSets,
                    tags: values.chTags,
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

                this.props.form.setFieldsValue({
                  'enShow': true,
                  'chName': "",
                  'chNamePrint': "",
                  'chPrice': "",
                  'chOldPrice': "",
                  'chDescription': "",
                  'iCategories': ""
                });
                

              }).catch((error) => {
                  console.error(error);
              });
              
            }
          }
        });
      }


      // Удаляем
      delete = () => {

        const url = this.props.optionapp[0].serverUrl + "/DeleteProducts.php"; // удаление
        fetch(url,
          {
              method: 'POST',
              body: JSON.stringify(
              {
                idDishes: this.props.param.idDishes,
                tmpFileName: this.state.fileList.length ? this.state.fileList[0].name : "",
             })
          }).then((response) => response.json()).then((responseJsonFromServer) =>
          {
              var val = {
                idDishes: this.props.param.idDishes,
              }
              this.props.onDelete(val);  // вызываем action
          }).catch((error) =>
          {
              console.error(error);
          });
          message.success('Товар удален'); 
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

      if(nextProps.param !== this.props.param) {

        this.DeleteTmpFile(); // удаляем временный файл

        /// создание, всё чистим
        if (nextProps.type === "0") {
          this.props.form.setFieldsValue({
            'enShow': true,
            'chName': '',
            'chNamePrint': '',
            'chPrice': '',
            'chOldPrice': '',
            'chDescription': '',
            'iCategories': '',
            'chOptionSets': '0',
            'chTags': [],
          });

        
          this.setState({
            dataSource: [],
            count: 0,
            iCategories: '',
            chOptionSets: '0',
            chTags: [],
            tmpFileName: generateKey(),
            fileList: [],
          });
        }

        
        if (nextProps.type === "2" || nextProps.type === "1") {

          this.props.form.setFieldsValue({
            'enShow': nextProps.param.enShow === "true",
            'chName': nextProps.param.chName + `${nextProps.type === "2" ? " - Копия" : "" }`,
            'chNamePrint': nextProps.param.chNamePrint,
            'chPrice': nextProps.param.chPrice,
            'chOldPrice': nextProps.param.chOldPrice,
            'chDescription': nextProps.param.chDescription,
            'iCategories': this.props.categories.find(x => x.idCategories ===  nextProps.param.iCategories).chName,
            'chOptionSets': nextProps.param.chOptionSets !== "0" ? this.props.optionSets.find(x => x.idOptionSets === nextProps.param.chOptionSets).chName : '0',
            'chTags': nextProps.param.tags
          });

          this.setState({
            iCategories: nextProps.param.iCategories,
            chTags: nextProps.param.tags,
            tmpFileName: generateKey(),
            dataSource: nextProps.param.ingredients,
            fileList: nextProps.param.chMainImage.length && nextProps.type !== "2" ? [{
              uid: '-1',
              name: nextProps.param.chMainImage.replace(/^.*(\\|\/|\:)/, ''),
              status: 'done',
              url: nextProps.param.chMainImage,
              }] : []
          });
        }
      
      }

    }

    DeleteTmpFile = () => {
      if (typeof this.state.fileList[0] !== 'undefined' && typeof this.state.fileList[0].response !== 'undefined') {
        const url = this.props.optionapp[0].serverUrl + "/DeleteTmpFile.php"; // удаление
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
        const labelColSpan = 8;
        const { dataSource, iCategories, chOptionSets, chTags, previewVisible, previewImage, fileList, tmpFileName } = this.state;
        const tmpFilePath = this.props.optionapp[0].serverUrl + "/UploadFile.php?fName=" + tmpFileName;
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };

        const options = this.props.categories.map(d => <Option key={d.idCategories} value={d.idCategories}>{d.chName}</Option>)
        const children = this.state.arrTags.map(d => <Option key={d.key} value={d.key}>{d.chName}</Option>);
        const childrenOptionSets = this.props.optionSets.map(d => <Option key={d.idOptionSets} value={d.idOptionSets}>{d.chName}</Option>)

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
               <h4>Удалить товар</h4>
               <Popconfirm title="Удалить товар?" onConfirm={() => this.delete()} okText="Да" cancelText="Нет">
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
                <Switch/>
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                    Имя&nbsp;
                    <Tooltip title="Имя товара">
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: 'Введите наименование товара' }],
                initialValue: this.props.type !== "0" ? this.props.param.chName + `${this.props.type === "2" ? " - Копия" : "" }` : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Наименование товара" maxLength="100"/>
              )}
            </FormItem>
            <FormItem
              label={
                  <span>
                      Отображаемое имя&nbsp;
                      <Tooltip title='При необходимости укажите имя, которое будет отображаться клиенту в приложении. Если поле пустое, то используется значение из поля "Имя".'>
                          <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                      </Tooltip>
                  </span>
              }
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chNamePrint', {
                rules: [{ }],
                initialValue: this.props.type !== "0" ? this.props.param.chNamePrint : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Отображаемое имя" maxLength="100" />
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                    Цена&nbsp;
                    <Tooltip title='Цена товара. В качестве разделителя используется "."'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chPrice', {
                rules: [{ required: true, message: 'Введите цену товара' }],
                getValueFromEvent: ({currentTarget: {value}}) => {
                  const convertedValue = value;
                  const re = /^(\d{0,7}\.\d{0,2}|\d{0,7}|\.\d{0,2})$/;
                  if (re.test(convertedValue)) {
                    return convertedValue;
                  } else {
                    return Number(this.props.form.getFieldValue("chPrice"));
                  }
                },
                initialValue: this.props.type !== "0" ? this.props.param.chPrice : ""
              })(
                <Input 
                  prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  placeholder="Цена" maxLength="10"/>
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                    Старая цена&nbsp;
                    <Tooltip title='Старая цена товара, будет показана в приложении зачеркнутой. В качестве разделителя используется "."'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              } 
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chOldPrice', {
                getValueFromEvent: ({currentTarget: {value}}) => {
                  const convertedValue = value;
                  const re = /^(\d{0,7}\.\d{0,2}|\d{0,7}|\.\d{0,2})$/;
                  if (re.test(convertedValue)) {
                    return convertedValue;
                  } else {
                    return Number(this.props.form.getFieldValue("chOldPrice"));
                  }
                },
                initialValue: this.props.type !== "0" ? this.props.param.chOldPrice : ""
              })(
                <Input prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Старая цена"  maxLength="10"/>
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                    Описание&nbsp;
                    <Tooltip title='Описание товара. До 200 символов.'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
              abelCol={{ span: labelColSpan }}
              style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chDescription', {
                rules: [{ }],
                initialValue: this.props.type !== "0" ? this.props.param.chDescription : ""
              })(
                <Input prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Описание"  maxLength="200"/>
              )}
            </FormItem>
            <FormItem 
              label={
                <span>
                    Категория&nbsp;
                    <Tooltip title='Выберите категорию товара.'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
               style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('iCategories', {
                rules: [{ required: true, message: 'Выберите категорию' }],
                initialValue: this.props.type !== "0" ? this.props.categories.find(x => x.idCategories ===  iCategories).chName : "",
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
              label={
                <span>
                    Набор&nbsp;
                    <Tooltip title='Набор представляет собой разновидность товара с одной измененной характеристикой. Например: размер пиццы, объём воды и т.п. Набор создается в разделе "Наборы"'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
               style={{ marginBottom: 10 }}
              hasFeedback
            >
              {getFieldDecorator('chOptionSets', {
                initialValue: chOptionSets,
              })(
                <Select
                  onChange={this.onChangeOptionSets}
                >
                  <Option key="0" value="0">Выберите набор опций</Option>
                  {childrenOptionSets}
              </Select>
              )}
            </FormItem>
            <FormItem 
              label={
                <span>
                    Тэги&nbsp;
                    <Tooltip title='Тэги товара. В приложении появятся соответствующие метки'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
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
              label={
                <span>
                    Изображение&nbsp;
                    <Tooltip title='Изображение товара. Рекомендуемый размер: 360x360 px'>
                        <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                    </Tooltip>
                </span>
              }
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
            <div className="ant-form-item-label">
              <label><span>
                      Опции&nbsp;
                      <Tooltip title='Дополнительные опции товара. Например: двойной сыр, лента для букета и т.п. Укажите наименование, порядок сортировки и значение увеличения цены'>
                          <Icon type="question-circle-o" style = {{ color: '#615f5f' }}/>
                      </Tooltip>
                  </span>
              </label>
            </div>
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
      owner: state.owner,
      optionSets: state.optionSets,
      optionapp: state.optionapp,
      tags: state.tags,
  }),
  dispatch => ({
    onAdd: (data) => {
      dispatch({ type: 'ADD_DISHES', payload: data});
    },
    onEdit: (data) => {
      dispatch({ type: 'EDIT_DISHES', payload: data});
    },
    onDelete: (data) => {
      dispatch({ type: 'DELETE_DISHES', payload: data});
    },
  })
)(WrappedNormalLoginForm);
